# frozen_string_literal: true

module Types
  class AppletSwapActionInputType < Types::BaseInputObject
    argument :base_asset_id, String, required: true
    argument :quote_asset_id, String, required: true
    argument :side, String, required: true
    argument :slippage, String, required: true
  end
end
