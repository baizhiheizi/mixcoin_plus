# frozen_string_literal: true

module Types
  class Applet4swapTriggerType < Types::AppletTriggerType
    field :params, Types::Applet4swapTriggerParamsType, null: false
    field :pay_asset, Types::MixinAssetType, null: false
    field :fill_asset, Types::MixinAssetType, null: false
  end
end
