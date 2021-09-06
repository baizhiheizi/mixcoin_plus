# frozen_string_literal: true

module Types
  class Applet4swapTriggerInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :description, String, required: false
    argument :base_asset_id, String, required: true
    argument :quote_asset_id, String, required: true
    argument :target_value, Float, required: true
    argument :target_index, String, required: true
    argument :compare_action, String, required: true
  end
end
