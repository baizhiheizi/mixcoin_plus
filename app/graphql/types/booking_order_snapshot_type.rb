# frozen_string_literal: true

module Types
  class BookingOrderSnapshotType < Types::BaseModelObject
    field :id, ID, null: false
    field :market_id, String, null: false
    field :ocean_order_id, String, null: false
    field :user_id, String, null: false
    field :funds, Float, null: false
    field :order_weight, Float, null: false
    field :price, Float, null: false
    field :scores, Float, null: false
    field :timestamp, Integer, null: false

    field :market, Types::MarketType, null: false
    field :user, Types::UserType, null: false
    field :ocean_order, Types::OceanOrderType, null: false

    def market
      BatchLoader::GraphQL.for(object.market_id).batch do |market_ids, loader|
        Market.where(id: market_ids).each { |market| loader.call(market.id, market) }
      end
    end

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end

    def ocean_order
      BatchLoader::GraphQL.for(object.ocean_order_id).batch do |ocean_order_ids, loader|
        OceanOrder.where(id: ocean_order_ids).each { |ocean_order| loader.call(ocean_order.id, ocean_order) }
      end
    end
  end
end
