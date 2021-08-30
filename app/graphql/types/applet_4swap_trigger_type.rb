# frozen_string_literal: true

module Types
  class Applet4swapTriggerType < Types::AppletTriggerType
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :target_value, Float, null: false
    field :target_index, String, null: false
    field :compare_action, String, null: false
  end
end
