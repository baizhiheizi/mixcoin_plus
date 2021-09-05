# frozen_string_literal: true

module Types
  class AppletMixSwapActionInputType < Types::BaseInputObject
    argument :description, String, required: false
    argument :pay_asset_id, String, required: true
    argument :fill_asset_id, String, required: true
    argument :pay_amount, Float, required: true
    argument :slippage, Float, required: true
  end
end
