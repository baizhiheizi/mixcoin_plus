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

  before_validation :set_defaults, on: :create

  validates :profit_asset_id, presence: true
  validates :raw, presence: true

  after_commit :notify_admin_async

  scope :without_drafted, -> { where.not(state: :drafted) }

  aasm column: :state do
    state :drafted, initial: true
    state :arbitraging
    state :completed
    state :canceled

    event :arbitrage do
      transitions from: :drafted, to: :arbitraging
    end
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
