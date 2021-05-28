# frozen_string_literal: true

module Resolvers
  class InvitationCommissionConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :after, String, required: false

    type Types::MixinTransferType.connection_type, null: false

    def resolve(**_params)
      current_user.transfers.with_transfer_type(:ocean_order_invitation_commission)
    end
  end
end
