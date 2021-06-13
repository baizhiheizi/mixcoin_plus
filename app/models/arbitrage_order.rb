# frozen_string_literal: true

# == Schema Information
#
# Table name: arbitrage_orders
#
#  id                 :uuid             not null, primary key
#  base_asset_profit  :float            default(0.0)
#  quote_asset_profit :float            default(0.0)
#  raw                :json
#  state              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  arbitrager_id      :uuid
#  market_id          :uuid
#
# Indexes
#
#  index_arbitrage_orders_on_arbitrager_id  (arbitrager_id)
#  index_arbitrage_orders_on_market_id      (market_id)
#
class ArbitrageOrder < ApplicationRecord
  MAX_EXPECTED_PROFIT_RATIO = 0.1
  TIMEOUT_SECONDS = 60

  extend Enumerize
  include AASM

  store :raw, accessors: %i[expected_profit profit_asset_id]

  belongs_to :market
  belongs_to :arbitrager, primary_key: :mixin_uuid, optional: true
  belongs_to :profit_asset, class_name: 'MixinAsset', primary_key: :asset_id

  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :swap_orders, dependent: :restrict_with_exception

  delegate :base_asset, :quote_asset, to: :market

  validates :raw, presence: true

  after_commit on: :create do
    if arbitrager_balance_sufficient? && expected_profit_reasonable?
      start_arbitrage!
    else
      notify_admin_async
    end
  end

  scope :without_drafted, -> { where.not(state: :drafted) }
  scope :only_timeout, -> { arbitraging.where(created_at: ...(Time.current - TIMEOUT_SECONDS.seconds)) }

  aasm column: :state do
    state :drafted, initial: true
    state :arbitraging
    state :completed
    state :canceled

    event :arbitrage, guards: %i[arbitrager_balance_sufficient?], after: %i[notify_admin_async] do
      transitions from: :drafted, to: :arbitraging
    end

    event :cancel, after_commit: %i[calculate_net_profit notify_admin_async] do
      transitions from: :arbitraging, to: :canceled
    end

    event :complete, guards: :ensure_ocean_and_swap_orders_finished, after_commit: %i[calculate_net_profit notify_admin_async] do
      transitions from: :arbitraging, to: :completed
    end
  end

  def start_arbitrage!
    ActiveRecord::Base.transaction do
      generate_ocean_order!
      # generate_swap_order!
      arbitrage!
    end
  end

  def calculate_net_profit
    case raw[:ocean][:side]
    when :bid
      update(
        quote_asset_profit: swap_orders.traded.sum(:fill_amount) - ocean_orders.sum(:filled_funds),
        base_asset_profit: ocean_orders.sum(:filled_amount) * (1 - OceanOrder::BASE_TAKER_FEE_RATIO) - swap_orders.traded.sum(:pay_amount)
      )
    when :ask
      update(
        quote_asset_profit: ocean_orders.sum(:filled_funds) * (1 - OceanOrder::BASE_TAKER_FEE_RATIO) - swap_orders.traded.sum(:pay_amount),
        base_asset_profit: swap_orders.traded.sum(:fill_amount) - ocean_orders.sum(:filled_amount)
      )
    end
  end

  def arbitrager_balance_sufficient?
    case raw[:ocean][:side]
    when :bid
      arbitrager_quote_balance >= raw[:ocean][:funds]
      # arbitrager_base_balance >= raw[:swap][:amount]
    when :ask
      arbitrager_base_balance >= raw[:ocean][:amount]
      # arbitrager_quote_balance >= raw[:swap][:funds]
    end
  end

  def expected_profit_reasonable?
    case raw[:ocean][:side]
    when :bid
      expected_profit / raw[:ocean][:funds] < MAX_EXPECTED_PROFIT_RATIO
    when :ask
      expected_profit / raw[:ocean][:amount] < MAX_EXPECTED_PROFIT_RATIO
    end
  end

  def arbitrager_quote_balance
    return 0 if arbitrager.blank?

    arbitrager.mixin_api.asset(market.quote_asset_id)['data']['balance'].to_f
  end

  def arbitrager_base_balance
    return 0 if arbitrager.blank?

    arbitrager.mixin_api.asset(market.base_asset_id)['data']['balance'].to_f
  end

  def generate_ocean_order!
    ocean_orders.create_with(
      broker: arbitrager,
      market: market,
      side: raw[:ocean][:side],
      order_type: :limit,
      price: raw[:ocean][:price],
      remaining_amount: raw[:ocean][:amount],
      remaining_funds: raw[:ocean][:funds]
    ).find_or_create_by!(
      trace_id: MixcoinPlusBot.api.unique_uuid(id, market_id)
    )
  end

  def generate_swap_order!
    swap_orders.create!(
      broker: arbitrager,
      pay_asset_id: raw[:swap][:side] == :bid ? market.quote_asset_id : market.base_asset_id,
      pay_amount: raw[:swap][:side] == :bid ? raw[:swap][:funds] : raw[:swap][:amount],
      fill_asset_id: raw[:swap][:side] == :bid ? market.base_asset_id : market.quote_asset_id
    )
  end

  def timeout?
    arbitraging? && (Time.current - created_at - TIMEOUT_SECONDS.seconds).positive?
  end

  def timeout!
    return unless arbitraging?

    ocean_orders.booking.where(created_at: ...(Time.current - TIMEOUT_SECONDS.seconds)).map(&:cancel!)
    ocean_orders.map(&:sync_with_engine)
    swap_orders.map(&:sync_order)
    complete! if may_complete?
  end

  def net_profit_usd
    return if drafted? || arbitraging?

    (quote_asset_profit * quote_asset.price_usd + base_asset_profit * base_asset.price_usd).floor(8)
  end

  def expected_profit_usd
    (expected_profit * profit_asset.price_usd).floor(8)
  end

  def notify_admin_async
    SendMixinMessageWorker.perform_async MixcoinPlusBot.api.plain_text(
      conversation_id: MixcoinPlusBot.api.unique_uuid(Rails.application.credentials.fetch(:admin_mixin_uuid)),
      data: "#{base_asset.symbol}/#{quote_asset.symbol} order #{state}, price: #{raw[:ocean][:price]}/#{raw[:swap][:price]}, profit:#{net_profit_usd || '-'}/#{expected_profit_usd} USD"
    )
  end

  def profit_asset
    @profit_asset ||= MixinAsset.find_by(asset_id: profit_asset_id)
  end

  private

  def ensure_ocean_and_swap_orders_finished
    ocean_orders.count.positive? && swap_orders.count.positive? && ocean_orders.without_finished.blank? && swap_orders.without_finished.blank?
  end
end
