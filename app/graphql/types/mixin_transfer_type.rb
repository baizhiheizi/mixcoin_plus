# frozen_string_literal: true

module Types
  class MixinTransferType < Types::BaseModelObject
    field :id, ID, null: false
    field :transfer_type, String, null: true
    field :trace_id, String, null: false
    field :snapshot_id, String, null: false
    field :asset_id, String, null: false
    field :user_id, String, null: false
    field :opponent_id, String, null: true
    field :amount, Float, null: false
    field :memo, String, null: true
    field :processed_at, GraphQL::Types::ISO8601DateTime, null: true

    field :recipient, Types::UserType, null: true
    field :asset, Types::MixinAssetType, null: false

    def recipient
      BatchLoader::GraphQL.for(object.opponent_id).batch do |opponent_ids, loader|
        User.where(mixin_uuid: opponent_ids).each { |recipient| loader.call(recipient.mixin_uuid, recipient) }
      end
    end

    def asset
      BatchLoader::GraphQL.for(object.asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |asset| loader.call(asset.asset_id, asset) }
      end
    end
  end
end
