# frozen_string_literal: true

module Types
  class BaseModelObject < BaseObject
    include ActionView::Helpers::DateHelper
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
