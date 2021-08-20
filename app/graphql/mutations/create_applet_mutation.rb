# frozen_string_literal: true

module Mutations
  class CreateAppletMutation < Mutations::AuthorizedMutation
    input_object_class Types::AppletInputType

    type Boolean

    def resolve(**params)
    end
  end
end
