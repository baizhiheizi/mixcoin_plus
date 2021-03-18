# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :admin_login, mutation: Mutations::AdminLoginMutation
  end
end
