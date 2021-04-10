# frozen_string_literal: true

module Resolvers
  class AdminUserConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::UserType.connection_type, null: false

    def resolve(*)
      User.all.order(created_at: :desc)
    end
  end
end
