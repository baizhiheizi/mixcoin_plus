# frozen_string_literal: true

# == Schema Information
#
# Table name: markets
#
#  id                 :uuid             not null, primary key
#  ocean_orders_count :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  base_asset_id      :uuid
#  quote_asset_id     :uuid
#
# Indexes
#
#  index_markets_on_base_asset_id   (base_asset_id)
#  index_markets_on_quote_asset_id  (quote_asset_id)
#
class Market < ApplicationRecord
  XIN_ASSET_ID = 'c94ac88f-4671-3976-b60a-09064f1811e8'
  BTC_ASSET_ID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'
  OMNI_USDT_ASSET_ID = '815b0b1a-2764-3736-8faa-42d694fa620a'
  ERC20_USDT_ASSET_ID = '4d8c508b-91c5-375b-92b0-ee702ed2dac5'
  PUSD_ASSET_ID = '31d2ea9c-95eb-3355-b65b-ba096853bc18'
  AVAILABLE_QUOTES = [ERC20_USDT_ASSET_ID, PUSD_ASSET_ID, XIN_ASSET_ID, BTC_ASSET_ID, OMNI_USDT_ASSET_ID].freeze

  # Ocean ONE accepts all assets in Mixin Network as base currencies,
  # and the only supported quote currencies are
  # Mixin XIN (c94ac88f-4671-3976-b60a-09064f1811e8),
  # Bitcoin BTC (c6d0c728-2624-429b-8e0d-d9d19b6592fa) and
  # Omni USDT (815b0b1a-2764-3736-8faa-42d694fa620a).
  # pUSD (31d2ea9c-95eb-3355-b65b-ba096853bc18).
  # Erc20 USDT (4d8c508b-91c5-375b-92b0-ee702ed2dac5).
  validates :quote_asset_id, presence: true, inclusion: { in: AVAILABLE_QUOTES }
  validates :base_asset_id, presence: true
  validate :ensure_quote_and_base_not_the_same

  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :snapshots, through: :ocean_orders, source: :snapshots

  default_scope -> { where.not(base_asset_id: [OMNI_USDT_ASSET_ID, PUSD_ASSET_ID, ERC20_USDT_ASSET_ID]) }

  scope :recommended, -> { where(base_asset_id: [XIN_ASSET_ID, BTC_ASSET_ID], quote_asset_id: [PUSD_ASSET_ID, ERC20_USDT_ASSET_ID, OMNI_USDT_ASSET_ID]) }
  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }

  def ocean_market_id
    format('%<base>s-%<quote>s', base: base_asset_id, quote: quote_asset_id)
  end

  def update_turnover
    update turnover: ocean_orders.sum(:filled_amount)
  end

  private

  def ensure_quote_and_base_not_the_same
    errors.add(:base_asset_id, 'cannot be same with quote') if base_asset_id == quote_asset_id
  end
end
