# frozen_string_literal: true

module Resolvers
  class AdminMixinTransferConnectionResolver < Resolvers::AdminBaseResolver
    argument :ocean_order_id, ID, required: false
    argument :transfer_type, String, required: false
    argument :user_id, ID, required: false
    argument :opponent_id, ID, required: false
    argument :after, String, required: false

    type Types::MixinTransferType.connection_type, null: false

    def resolve(**params)
      transfers = 
        if params[:ocean_order_id].present?
          MixinTransfer.where(source_id: params[:ocean_order_id], source_type: 'OceanOrder')
        else
          MixinTransfer.all
        end

      transfers = transfers.where(user_id: params[:user_id]) if params[:user_id].present?
      transfers = transfers.where(opponent_id: params[:opponent_id]) if params[:opponent_id].present?

      transfer_type = params[:transfer_type] || 'all'
      transfers =
        case transfer_type
        when 'all'
          transfers
        else
          transfers.where(transfer_type: transfer_type)
        end

      transfers.order(created_at: :desc)
    end
  end
end
