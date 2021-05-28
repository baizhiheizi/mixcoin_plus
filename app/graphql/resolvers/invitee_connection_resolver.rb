# frozen_string_literal: true

module Resolvers
  class InviteeConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :after, String, required: false

    type Types::UserType.connection_type, null: false

    def resolve(**_params)
      current_user.invitees
    end
  end
end
