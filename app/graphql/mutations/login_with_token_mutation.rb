# frozen_string_literal: true

module Mutations
  class LoginWithTokenMutation < Mutations::BaseMutation
    argument :token, String, required: true

    type Types::UserType

    def resolve(token:)
      user = User.auth_from_mixin access_token: token
      return if user.blank?

      context[:session][:current_user_id] = user.id
      user
    end
  end
end
