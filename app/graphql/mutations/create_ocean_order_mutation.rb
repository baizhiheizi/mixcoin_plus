# frozen_string_literal: true

module Mutations
  class CreateOceanOrderMutation < Mutations::AuthorizedMutation
    argument :ocean_market_id, ID, required: true
    argument :side, String, required: true
    argument :order_type, String, required: true
    argument :price, String, required: true
    argument :funds, String, required: true

    type Types::OceanOrderType

    def resolve(params)
      return if current_user.blank?

      current_user.ocean_orders.create!(
        ocean_market_id: params[:ocean_market_id],
        side: params[:side],
        order_type: params[:order_type],
        price: params[:price].to_f,
        remaining_amount: if params[:side] == 'ask'
                            params[:funds].to_f.round(8)
                          else
                            params[:order_type] == 'limit' ? (params[:funds].to_f / params[:price]).round(8) : 0.0
                          end,
        remaining_funds: (params[:side] == 'ask' ? params[:funds].to_f * params[:price].to_f : params[:funds].to_f).round(8)
      )
    end
  end
end
