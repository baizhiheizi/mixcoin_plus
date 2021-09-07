# frozen_string_literal: true

module Types
  class AppletMixSwapActionType < Types::AppletActionType
    field :params, Types::Applet4swapActionParamsType, null: false
    field :pay_asset, Types::MixinAssetType, null: false
    field :fill_asset, Types::MixinAssetType, null: false
  end
end
