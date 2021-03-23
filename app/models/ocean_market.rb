# frozen_string_literal: true

# == Schema Information
#
# Table name: ocean_markets
#
#  id                 :uuid             not null, primary key
#  base_asset_symbol  :string
#  maker_turnover     :decimal(, )      default(0.0)
#  quote_asset_symbol :string
#  taker_turnover     :decimal(, )      default(0.0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  base_asset_id      :uuid
#  quote_asset_id     :uuid
#
# Indexes
#
#  index_ocean_markets_on_base_asset_id   (base_asset_id)
#  index_ocean_markets_on_quote_asset_id  (quote_asset_id)
#
class OceanMarket < ApplicationRecord
  XIN_ASSET_ID = 'c94ac88f-4671-3976-b60a-09064f1811e8'
  BTC_ASSET_ID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'
  USDT_ASSET_ID = '815b0b1a-2764-3736-8faa-42d694fa620a'
  PUSD_ASSET_ID = '31d2ea9c-95eb-3355-b65b-ba096853bc18'
  AVAILABLE_QUOTES = [XIN_ASSET_ID, BTC_ASSET_ID, USDT_ASSET_ID, PUSD_ASSET_ID].freeze

  before_validation :set_defaults, on: :create

  # Ocean ONE accepts all assets in Mixin Network as base currencies,
  # and the only supported quote currencies are
  # Mixin XIN (c94ac88f-4671-3976-b60a-09064f1811e8),
  # Bitcoin BTC (c6d0c728-2624-429b-8e0d-d9d19b6592fa) and
  # Omni USDT (815b0b1a-2764-3736-8faa-42d694fa620a).
  # pUSD (31d2ea9c-95eb-3355-b65b-ba096853bc18).
  validates :quote_asset_id, presence: true, inclusion: { in: AVAILABLE_QUOTES }
  validates :base_asset_id, presence: true
  validate :ensure_quote_and_base_not_the_same

  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :snapshots, through: :ocean_orders, source: :snapshots

  def market_id
    format('%<base>s-%<quote>s', base: base_asset_id, quote: quote_asset_id)
  end

  private

  def set_defaults
    assign_attributes(
      base_asset_symbol: base_asset.symbol,
      quote_asset_symbol: quote_asset.symbol
    )
  end

  def ensure_quote_and_base_not_the_same
    errors.add(:base_asset_id, 'cannot be same with quote') if base_asset_id == quote_asset_id
  end
end
