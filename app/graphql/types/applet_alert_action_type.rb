# frozen_string_literal: true

module Types
  class AppletAlertActionType < Types::AppletActionType
    field :data, String, null: false
    field :via, String, null: true
    field :params, Types::AppletAlertActionParamsType, null: false
  end
end
