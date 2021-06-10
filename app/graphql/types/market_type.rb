# frozen_string_literal: true

module Types
  class MarketType < Types::BaseModelObject
    field :id, ID, null: false
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :ocean_market_id, String, null: false
    field :ocean_orders_count, Int, null: false
    field :trades_count, Int, null: false
    field :favorited, Boolean, null: true
    field :recommended, Boolean, null: true
    field :booking_order_activity_enable, Boolean, null: true
    field :hidden_at, GraphQL::Types::ISO8601DateTime, null: true

    field :price_current, Float, null: true
    field :price_24h_ago, Float, null: true
    field :change_24h, Float, null: true
    field :vol_24h, Float, null: true

    field :high_price_24h, Float, null: true
    field :low_price_24h, Float, null: true

    field :base_asset, Types::MixinAssetType, null: false
    field :quote_asset, Types::MixinAssetType, null: false

    def recommended
      object.recommended?
    end

    def favorited
      return if context[:current_user].blank?

      context[:current_user].find_action(:favorite, target: object)
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
