# frozen_string_literal: true

module Types
  class Applet4swapActionType < Types::AppletActionType
    field :pay_asset_id, String, null: false
    field :fill_asset_id, String, null: false
    field :pay_amount, Float, null: false
    field :slippage, Float, null: false
    field :pay_asset, Types::MixinAssetType, null: false
    field :fill_asset, Types::MixinAssetType, null: false
    field :params, Types::Applet4swapActionParamsType, null: false
  end
end
