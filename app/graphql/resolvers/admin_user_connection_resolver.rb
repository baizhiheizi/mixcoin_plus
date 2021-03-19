# frozen_string_literal: true

module Resolvers
  class AdminUserConnectionResolver < Resolvers::AdminBaseResolver
    type Types::UserType.connection_type, null: false

    def resolve
      User.all
    end
  end
end
