# frozen_string_literal: true

module Types
  class AppletPandoRingsTriggerParamsType < Types::AppletTriggerType
    field :description, String, null: false
    field :asset_id, String, null: true
    field :target_value, Float, null: true
    field :target_index, String, null: false
    field :compare_action, String, null: false
  end
end
