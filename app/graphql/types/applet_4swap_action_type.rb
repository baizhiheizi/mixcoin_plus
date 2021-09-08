# frozen_string_literal: true

module Types
  class Applet4swapActionType < Types::AppletActionType
    field :pay_asset, Types::MixinAssetType, null: false
    field :fill_asset, Types::MixinAssetType, null: false
    field :params, Types::Applet4swapActionParamsType, null: false
  end
end
