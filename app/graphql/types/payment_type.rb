# frozen_string_literal: true

module Types
  class PaymentType < Types::BaseModelObject
    field :id, ID, null: false
    field :trace_id, String, null: false
    field :state, String, null: false
    field :asset_id, String, null: true
    field :opponent_id, String, null: true
    field :snapshot_id, String, null: true
    field :conversation_id, String, null: true
    field :amount, Float, null: true
    field :memo, String, null: true

    field :asset, Types::MixinAssetType, null: false
    field :opponent, Types::UserType, null: true

    def opponent
      BatchLoader::GraphQL.for(object.opponent_id).batch do |opponent_ids, loader|
        User.where(mixin_uuid: opponent_ids).each { |opponent| loader.call(opponent.mixin_uuid, opponent) }
      end
    end

    def asset
      BatchLoader::GraphQL.for(object.asset_id).batch do |asset_ids, loader|
        MixinAsset.where(asset_id: asset_ids).each { |asset| loader.call(asset.asset_id, asset) }
      end
    end
  end
end
