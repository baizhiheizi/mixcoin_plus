# frozen_string_literal: true

module Mutations
  class CreateOceanOrderMutation < Mutations::AuthorizedMutation
    argument :market_id, ID, required: true
    argument :side, String, required: true
    argument :order_type, String, required: true
    argument :price, String, required: true
    argument :funds, String, required: true

    type Types::OceanOrderType

    def resolve(params)
      return if current_user.blank?

      price = params[:price].to_f
      funds = params[:funds].to_f
      current_user.ocean_orders.create!(
        conversation_id: context[:current_conversation_id],
        market_id: params[:market_id],
        side: params[:side],
        order_type: params[:order_type],
        price: price,
        remaining_amount: if params[:side] == 'ask'
                            funds.round(8)
                          else
                            params[:order_type] == 'limit' ? (funds / price).round(8) : 0.0
                          end,
        remaining_funds: (params[:side] == 'ask' ? funds * price : funds).round(8)
      )
    end
  end
end
