# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_assets
#
#  id         :uuid             not null, primary key
#  change_btc :float
#  change_usd :float
#  price_btc  :float
#  price_usd  :float
#  raw        :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#
# Indexes
#
#  index_mixin_assets_on_asset_id  (asset_id) UNIQUE
#
class MixinAsset < ApplicationRecord
  store :raw, accessors: %i[name symbol chain_id icon_url change_usd change_btc price_usd price_btc]

  after_commit :generate_markets_async, on: :create

  def self.find_or_create_by_asset_id(_asset_id)
    currency = find_by(asset_id: _asset_id)
    return currency if currency.present?

    r = MixcoinPlusBot.api.read_asset(_asset_id)
    create_with(raw: r['data']).find_or_create_by(asset_id: r['data']&.[]('asset_id'))
  end

  def sync!
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
end
