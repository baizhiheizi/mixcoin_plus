# frozen_string_literal: true

module Types
  class BookingOrderActivityType < Types::BaseModelObject
    field :id, ID, null: false
    field :market_id, String, null: false
    field :started_at, GraphQL::Types::ISO8601DateTime, null: false
    field :ended_at, GraphQL::Types::ISO8601DateTime, null: false
    field :bonus_total, Float, null: true
    field :scores_total, Float, null: false
    field :avg_funds, Float, null: true
    field :participants_count, Integer, null: true
    field :traded_amount, Float, null: true
    field :traded_funds, Float, null: true
    field :valid_order_snapshots_count, Integer, null: false
    field :bonus_asset_id, String, null: true

    field :market, Types::MarketType, null: false
    field :bonus_asset, Types::MixinAssetType, null: false

    def market
      BatchLoader::GraphQL.for(object.market_id).batch do |market_ids, loader|
        Market.where(id: market_ids).each { |market| loader.call(market.id, market) }
      end
    end

    def bonus_asset
      BatchLoader::GraphQL.for(object.bonus_asset_id).batch do |bonus_asset_ids, loader|
        MixinAsset.where(asset_id: bonus_asset_ids).each { |mixin_asset| loader.call(mixin_asset.asset_id, mixin_asset) }
      end
    end
  end
end
