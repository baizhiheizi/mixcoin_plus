# frozen_string_literal: true

module Types
  class AppletDatetimeTriggerType < Types::AppletTriggerType
    field :cron_value, String, null: false
    field :frequency, Int, null: false
    field :params, Types::AppletDatetimeTriggerParamsType, null: false
  end
end
