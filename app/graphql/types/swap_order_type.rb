# frozen_string_literal: true

module Types
  class SwapOrderType < Types::BaseModelObject
    field :id, ID, null: false
    field :type, String, null: false
    field :trace_id, String, null: false
    field :arbitrage_order_id, String, null: true
    field :applet_activity_id, String, null: true
    field :state, String, null: false
    field :pay_amount, Float, null: false
    field :fill_amount, Float, null: true
    field :min_amount, Float, null: true
    field :broker_id, String, null: false
    field :pay_asset_id, String, null: false
    field :fill_asset_id, String, null: false
    field :pay_url, String, null: true

    field :user, Types::UserType, null: true
    field :broker, Types::MixinNetworkUserType, null: false
    field :pay_asset, Types::MixinAssetType, null: false
    field :fill_asset, Types::MixinAssetType, null: false

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end

    def pay_asset
      BatchLoader::GraphQL.for(object.pay_asset_id).batch do |pay_asset_ids, loader|
        MixinAsset.where(asset_id: pay_asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end

    def fill_asset
      BatchLoader::GraphQL.for(object.fill_asset_id).batch do |fill_asset_ids, loader|
        MixinAsset.where(asset_id: fill_asset_ids).each { |currency| loader.call(currency.asset_id, currency) }
      end
    end
  end
end
