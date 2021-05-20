# frozen_string_literal: true

module Types
  class ArbitrageOrderType < Types::BaseModelObject
    field :id, ID, null: false
    field :market_id, String, null: false
    field :state, String, null: false
    field :net_profit, Float, null: true
    field :expected_profit, Float, null: true
    field :raw, String, null: false

    field :market, Types::MarketType, null: false
    field :arbitrager, Types::MixinNetworkUserType, null: false
    field :profit_asset, Types::MixinAssetType, null: false

    def market
      BatchLoader::GraphQL.for(object.market_id).batch do |market_ids, loader|
        Market.where(id: market_ids).each { |market| loader.call(market.id, market) }
      end
    end

    def profit_asset
      BatchLoader::GraphQL.for(object.profit_asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end
  end
end
