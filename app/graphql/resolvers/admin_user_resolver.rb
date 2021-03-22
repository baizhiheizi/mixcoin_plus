# frozen_string_literal: true

module Resolvers
  class AdminUserResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::UserType, null: false

    def resolve(id:)
      User.find(id)
    end
  end
end
