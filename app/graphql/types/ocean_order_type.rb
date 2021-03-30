# frozen_string_literal: true

module Types
  class OceanOrderType < Types::BaseModelObject
    field :id, ID, null: false
    field :market_id, String, null: false
    field :trace_id, String, null: false
    field :conversation_id, String, null: true
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :side, String, null: false
    field :order_type, String, null: false
    field :state, String, null: false
    field :price, Float, null: false
    field :amount, Float, null: false
    field :funds, Float, null: false
    field :remaining_amount, Float, null: false
    field :remaining_funds, Float, null: false
    field :filled_amount, Float, null: false
    field :filled_funds, Float, null: false
    field :pay_url, String, null: false

    field :user, Types::UserType, null: false
    field :broker, Types::MixinNetworkUserType, null: false
    field :base_asset, Types::MixinAssetType, null: false
    field :quote_asset, Types::MixinAssetType, null: false
    field :snapshots, [Types::MixinNetworkSnapshotType], null: true

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
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

    def snapshots
      BatchLoader::GraphQL.for(object.id).batch(default_value: []) do |order_ids, loader|
        OceanSnapshot.where(source_id: order_ids, source_type: 'OceanOrder').each do |snapshot|
          loader.call(snapshot.source_id) { |order| order << snapshot }
        end
      end
    end
  end
end
