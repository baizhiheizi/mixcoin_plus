# frozen_string_literal: true

module Mutations
  class CreateIfttbOrderMutation < Mutations::AuthorizedMutation
    argument :order_type, String, required: true
    argument :asset_id, String, required: true

    type Types::IfttbOrderType

    def resolve(**params)
      current_user.ifttb_orders.create(
        order_type: params[:order_type],
        asset_id: params[:asset_id]
      )
    end
  end
end
