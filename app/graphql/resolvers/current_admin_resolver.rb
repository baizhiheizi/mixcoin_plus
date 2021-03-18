# frozen_string_literal: true

module Resolvers
  class CurrentAdminResolver < Resolvers::AdminBaseResolver
    type Types::AdministratorType, null: false

    def resovle
      current_admin
    end
  end
end
