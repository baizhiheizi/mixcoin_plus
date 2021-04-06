# frozen_string_literal: true

module Types
  class UserAssetType < Types::BaseModelObject
    field :id, ID, null: false
    field :asset_id, String, null: false
    field :name, String, null: false
    field :symbol, String, null: false
    field :balance, Float, null: false
    field :balance_usd, Float, null: false
    field :change_usd, Float, null: true
    field :change_btc, Float, null: true
    field :icon_url, String, null: true
    field :chain_id, String, null: true
    field :price_btc, Float, null: true
    field :price_usd, Float, null: true

    field :chain_asset, Types::MixinAssetType, null: true

    def chain_asset
      BatchLoader::GraphQL.for(object.chain_id).batch do |chain_ids, loader|
        MixinAsset.where(asset_id: chain_ids).each { |asset| loader.call(asset.asset_id, asset) }
      end
    end
  end
end
