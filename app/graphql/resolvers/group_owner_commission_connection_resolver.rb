# frozen_string_literal: true

module Resolvers
  class GroupOwnerCommissionConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :after, String, required: false

    type Types::MixinTransferType.connection_type, null: false

    def resolve(**_params)
      current_user.transfers.with_transfer_type(:ocean_order_group_owner_commission)
    end
  end
end
