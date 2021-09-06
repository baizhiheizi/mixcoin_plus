# frozen_string_literal: true

module Types
  class AppletActionInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :type, String, required: true
    argument :description, String, required: false
    argument :params, GraphQL::Types::JSON, required: true
    argument :_destroy, Boolean, required: false
  end
end
