# frozen_string_literal: true

module Mutations
  class CreateIfttbBrokerWithdrawTransferMutation < Mutations::AuthorizedMutation
    argument :asset_id, String, required: true
    argument :amount, String, required: true

    type Types::MixinTransferType

    def resolve(params)
      return if current_user.blank?

      MixinTransfer.create!(
        transfer_type: :withdraw_to_user,
        wallet: current_user.ifttb_broker,
        recipient: current_user,
        asset_id: params[:asset_id],
        amount: params[:amount],
        memo: 'WITHDRAW FROM IFTTB',
        trace_id: SecureRandom.uuid
      )
    end
  end
end
