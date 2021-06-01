# frozen_string_literal: true

# == Schema Information
#
# Table name: arbitrage_orders
#
#  id              :uuid             not null, primary key
#  net_profit      :decimal(, )
#  raw             :json
#  state           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  arbitrager_id   :uuid
#  market_id       :uuid
#  profit_asset_id :string
#
# Indexes
#
#  index_arbitrage_orders_on_arbitrager_id  (arbitrager_id)
#  index_arbitrage_orders_on_market_id      (market_id)
#
class ArbitrageOrder < ApplicationRecord
  extend Enumerize
  include AASM

  store :raw, accessors: %i[expected_profit]

  belongs_to :market
  belongs_to :arbitrager, primary_key: :mixin_uuid, optional: true
  belongs_to :profit_asset, class_name: 'MixinAsset', primary_key: :asset_id

  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :swap_orders, dependent: :restrict_with_exception

  before_validation :set_defaults, on: :create

  validates :profit_asset_id, presence: true
  validates :raw, presence: true

  after_commit on: :create do
    notify_admin_async
    arbitrage! if arbitrager_balance_sufficient?
  end

  scope :without_drafted, -> { where.not(state: :drafted) }

  aasm column: :state do
    state :drafted, initial: true
    state :arbitraging
    state :completed
    state :canceled

    event :arbitrage, guards: %i[arbitrager_balance_sufficient?], after: %i[generate_ocean_order] do
      transitions from: :drafted, to: :arbitraging
    end

    event :cancel, after: :calculate_net_profit do
      transitions from: :arbitraging, to: :canceled
    end

    event :complete do
      transitions from: :arbitraging, to: :completed
    end
  end

  def arbitrager_balance_sufficient?
    case raw[:ocean][:side]
    when :bid
      arbitrager_balance >= raw[:ocean][:funds]
    when :ask
      arbitrager_balance >= raw[:ocean][:amount]
    end
  end

  def arbitrager_balance
    return 0 if arbitrager.blank?

    arbitrager.mixin_api.asset(profit_asset_id)['data']['balance'].to_f
  end

  def generate_ocean_order
    ocean_orders.create(
      broker: arbitrager,
      market: market,
      side: raw[:ocean][:side],
      order_type: :limit,
      price: raw[:ocean][:price],
      remaining_amount: raw[:ocean][:amount],
      remaining_funds: raw[:ocean][:funds]
    )
  end

  def notify_admin_async
    SendMixinMessageWorker.perform_async MixcoinPlusBot.api.plain_text(
      conversation_id: MixcoinPlusBot.api.unique_uuid(Rails.application.credentials.fetch(:admin_mixin_uuid)),
      data: "#{market.base_asset.symbol}/#{market.quote_asset.symbol} arbitrage order created, expected profit: #{(raw['expected_profit'] * profit_asset.price_usd).round(4)} USD"
    )
  end

  private

  def set_defaults
    assign_attributes(
      profit_asset_id: raw['profit_asset_id']
    )
  end
end
