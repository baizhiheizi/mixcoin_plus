# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_assets
#
#  id         :uuid             not null, primary key
#  raw        :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#
# Indexes
#
#  index_mixin_assets_on_asset_id  (asset_id) UNIQUE
#
class MixinAsset < ApplicationRecord
  store :raw, accessors: %i[name symbol chain_id icon_url price_btc price_usd]

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
end
