# frozen_string_literal: true

module Types
  class OceanMarketType < Types::BaseModelObject
    field :id, ID, null: false
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :maker_turnover, Float, null: false
    field :taker_turnover, Float, null: false
    field :market_id, String, null: false

    field :base_asset, Types::MixinAssetType, null: false
    field :quote_asset, Types::MixinAssetType, null: false

    def base_asset
      BatchLoader::GraphQL.for(object.base_asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end

    def quote_asset
      BatchLoader::GraphQL.for(object.quote_asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end
  end
end
