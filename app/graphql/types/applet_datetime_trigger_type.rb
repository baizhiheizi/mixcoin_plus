# frozen_string_literal: true

module Types
  class AppletDatetimeTriggerType < Types::AppletTriggerType
    field :minute, String, null: false
    field :hour, String, null: false
    field :day, String, null: false
    field :month, String, null: false
    field :wday, String, null: false
  end
end
