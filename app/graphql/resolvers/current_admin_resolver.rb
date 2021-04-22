# frozen_string_literal: true

module Resolvers
  class CurrentAdminResolver < Resolvers::AdminBaseResolver
    type Types::AdministratorType, null: false

    def resolve
      current_admin
    end
  end
end
