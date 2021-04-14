# frozen_string_literal: true

module Resolvers
  class AdminInvitationConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :invitor_id, String, required: false

    type Types::InvitationType.connection_type, null: false

    def resolve(**params)
      invitations =
        if params[:invitor_id]
          Invitation.where(invitor_id: params[:invitor_id])
        else
          Invitation.all
        end

      invitations.order(created_at: :desc)
    end
  end
end
