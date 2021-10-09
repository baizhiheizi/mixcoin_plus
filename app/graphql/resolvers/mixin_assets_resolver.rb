# frozen_string_literal: true

module Resolvers
  class MixinAssetsResolver < Resolvers::BaseResolver
    argument :source, String, required: false

    type [Types::MixinAssetType], null: false

    def resolve(source:)
      case source.to_sym
      when :'4swap'
        MixinAsset.where(asset_id: Foxswap.api.tradable_asset_ids)
      when :MixSwap
        MixinAsset.where(asset_id: MixSwap.api.tradable_asset_ids)
      when :PandoLeaf
        MixinAsset.where(asset_id: PandoLeaf.api.supportable_asset_ids)
      when :ifttb_order
        MixinAsset.where(asset_id: IfttbOrder::ACCEPTABLE_ASSETS_IDS)
      end
    end
  end
end
