# frozen_string_literal: true

module Types
  class AppletDatetimeTriggerParamsType < Types::AppletTriggerType
    field :description, String, null: false
    field :minute, String, null: false
    field :hour, String, null: false
    field :day, String, null: false
    field :month, String, null: false
    field :wday, String, null: false
  end
end
