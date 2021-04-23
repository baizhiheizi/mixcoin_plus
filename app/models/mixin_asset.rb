# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_assets
#
#  id         :uuid             not null, primary key
#  name       :string
#  price_usd  :decimal(, )
#  raw        :jsonb            not null
#  symbol     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#  chain_id   :uuid
#
# Indexes
#
#  index_mixin_assets_on_asset_id  (asset_id) UNIQUE
#
class MixinAsset < ApplicationRecord
  store :raw, accessors: %i[icon_url change_usd change_btc price_btc]

  before_validation :set_defaults, on: :create
  after_commit :generate_markets_async, on: :create

  belongs_to :chain_asset, class_name: 'MixinAsset', primary_key: :assets_id, foreign_key: :chain_id, inverse_of: false, optional: true

  scope :with_price, -> { where('price_usd > ?', 0) }

  def self.find_or_create_by_asset_id(_asset_id)
    currency = find_by(asset_id: _asset_id)
    return currency if currency.present?

    r = MixcoinPlusBot.api.read_asset(_asset_id)
    create_with(raw: r['data']).find_or_create_by(asset_id: r['data']&.[]('asset_id'))
  end

  def sync
    return if updated_at > Time.current - 10.minutes

    r = MixcoinPlusBot.api.asset asset_id
    update! raw: r['data']
  end

  def generate_markets_async
    MixinAssetGenerateMarketsWorker.perform_async id
  end

  def generate_markets!
    Market::AVAILABLE_QUOTES.each do |quote|
      next if quote == asset_id

      Market.find_or_create_by!(base_asset_id: asset_id, quote_asset_id: quote)
    end
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      name: raw['name'],
      symbol: raw['symbol'],
      chain_id: raw['chain_id']
    )
  end
end
