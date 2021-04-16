# frozen_string_literal: true

# == Schema Information
#
# Table name: trades
#
#  id             :uuid             not null, primary key
#  amount         :decimal(, )
#  price          :decimal(, )
#  raw            :json             not null
#  side           :string
#  traded_at      :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  base_asset_id  :uuid             not null
#  market_id      :uuid             not null
#  quote_asset_id :uuid             not null
#  trade_id       :uuid             not null
#
# Indexes
#
#  index_trades_on_base_asset_id   (base_asset_id)
#  index_trades_on_market_id       (market_id)
#  index_trades_on_quote_asset_id  (quote_asset_id)
#  index_trades_on_trade_id        (trade_id) UNIQUE
#
class Trade < ApplicationRecord
  extend Enumerize

  belongs_to :market, counter_cache: true
  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false

  before_validation :set_defaults, on: :create

  validates :trade_id, presence: true, uniqueness: true
  validates :base_asset_id, presence: true
  validates :quote_asset_id, presence: true
  validates :amount, presence: true
  validates :price, presence: true
  validates :side, presence: true
  validates :raw, presence: true
  validates :traded_at, presence: true

  enumerize :side, in: %w[ask bid], scope: true, predicates: true

  private

  def set_defaults
    assign_attributes(
      amount: raw['amount'].to_f,
      price: raw['price'].to_f,
      side: raw['side'].downcase,
      traded_at: raw['created_at'],
      base_asset_id: raw['base'],
      quote_asset_id: raw['quote'],
      trade_id: raw['trade_id']
    )
  end
end
