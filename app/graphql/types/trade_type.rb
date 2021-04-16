# frozen_string_literal: true

module Types
  class TradeType < Types::BaseModelObject
    field :id, ID, null: false
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :market_id, String, null: false
    field :amount, Float, null: false
    field :price, Float, null: true

    field :market, Types::MarketType, null: false
    field :base_asset, Types::MixinAssetType, null: false
    field :quote_asset, Types::MixinAssetType, null: false

    def market
      BatchLoader::GraphQL.for(object.market_id).batch do |market_ids, loader|
        Market.where(id: market_ids).each { |market| loader.call(market.id, market) }
      end
    end

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
