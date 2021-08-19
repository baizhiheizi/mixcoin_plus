# frozen_string_literal: true

module Types
  class AppletSwapActionType < Types::AppletActionType
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :side, String, null: false
    field :slippage, Float, null: false
  end
end
