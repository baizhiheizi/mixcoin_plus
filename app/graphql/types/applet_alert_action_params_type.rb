# frozen_string_literal: true

module Types
  class AppletAlertActionParamsType < Types::AppletActionType
    field :description, String, null: false
    field :via, String, null: false
    field :data, String, null: true
  end
end
