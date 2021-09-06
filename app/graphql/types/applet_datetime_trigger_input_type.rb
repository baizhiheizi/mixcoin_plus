# frozen_string_literal: true

module Types
  class AppletDatetimeTriggerInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :description, String, required: false
    argument :minute, String, required: true
    argument :hour, String, required: true
    argument :day, String, required: true
    argument :month, String, required: true
    argument :wday, String, required: true
  end
end
