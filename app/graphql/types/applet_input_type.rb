# frozen_string_literal: true

module Types
  class AppletInputType < Types::BaseInputObject
    argument :title, String, required: true
    argument :applet_datetime_trigger, Types::AppletDatetimeTriggerInputType, required: false
    argument :applet_swap_action, Types::AppletSwapActionInputType, required: false
  end
end
