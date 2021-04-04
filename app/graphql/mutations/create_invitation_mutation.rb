# frozen_string_literal: true

module Mutations
  class CreateInvitationMutation < Mutations::AuthorizedMutation
    argument :invite_code, String, required: true

    type Boolean

    def resolve(invite_code:)
      return if current_user.blank?

      invitor = User.find_by invite_code: invite_code
      return if invitor.blank?
      return unless context[:current_conversation_id] == MixcoinPlusBot.api.unique_uuid(current_user.mixin_uuid, invitor.mixin_uuid)

      current_user.invitation&.destroy
      invitor.invitations.create!(
        invitee: current_user
      )
    end
  end
end
