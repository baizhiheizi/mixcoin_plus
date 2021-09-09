# frozen_string_literal: true

module Types
  class IfttbOrderType < Types::BaseModelObject
    field :id, ID, null: false
    field :state, String, null: false
    field :order_type, String, null: false
    field :amount, Float, null: false
    field :amount_usd, Float, null: false

    field :pay_url, String, null: false

    field :user, Types::UserType, null: false
    field :asset, Types::MixinAssetType, null: false

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end

    def asset
      BatchLoader::GraphQL.for(object.asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |asset| loader.call(asset.asset_id, asset) }
      end
    end
  end
end
