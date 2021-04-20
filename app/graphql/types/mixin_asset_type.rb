# frozen_string_literal: true

module Types
  class MixinAssetType < Types::BaseModelObject
    field :id, ID, null: false
    field :asset_id, String, null: false
    field :name, String, null: false
    field :symbol, String, null: false
    field :icon_url, String, null: true
    field :chain_id, String, null: true
    field :price_btc, Float, null: true
    field :price_usd, Float, null: true
    field :change_usd, Float, null: true

    field :balance, Float, null: true

    field :chain_asset, Types::MixinAssetType, null: true

    def chain_asset
      BatchLoader::GraphQL.for(object.chain_id).batch do |chain_ids, loader|
        MixinAsset.where(asset_id: chain_ids).each { |asset| loader.call(asset.asset_id, asset) }
      end
    end

    def balance
      return if context[:current_user].blank?

      context[:current_user].assets.find_by(asset_id: object.asset_id)&.balance
    end
  end
end
