# frozen_string_literal: true

module Types
  class Applet4swapTriggerType < Types::AppletTriggerType
    field :params, Types::Applet4swapTriggerParamsType, null: false
    field :base_asset, Types::MixinAssetType, null: false
    field :quote_asset, Types::MixinAssetType, null: false
  end
end
