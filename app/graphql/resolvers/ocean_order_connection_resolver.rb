# frozen_string_literal: true

module Resolvers
  class OceanOrderConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :market_id, ID, required: false
    argument :filter, String, required: false
    argument :after, String, required: false

    type Types::OceanOrderType.connection_type, null: false

    def resolve(params)
      orders =
        if (params[:market_id]).present?
          current_user.ocean_orders.where(market_id: params[:market_id])
        else
          current_user.ocean_orders
        end

      orders =
        case params[:filter]
        when 'booking'
          orders.where(state: %i[booking canceling])
        when 'history'
          orders.where(state: %i[completed refunded])
        else
          orders.without_drafted
        end

      orders.order(created_at: :desc)
    end
  end
end
