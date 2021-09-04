# frozen_string_literal: true

module Types
  class AppletMixSwapActionType < Types::AppletActionType
    field :pay_asset_id, String, null: false
    field :fill_asset_id, String, null: false
    field :pay_amount, Float, null: false
    field :slippage, Float, null: false
  end
end
