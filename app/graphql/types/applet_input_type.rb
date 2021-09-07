# frozen_string_literal: true

module Types
  class AppletInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :title, String, required: true
    argument :applet_triggers_attributes, [Types::AppletTriggerInputType], required: false
    argument :applet_actions_attributes, [Types::AppletActionInputType], required: false
  end
end
