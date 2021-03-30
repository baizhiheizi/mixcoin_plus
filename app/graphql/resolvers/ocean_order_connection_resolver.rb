# frozen_string_literal: true

module Resolvers
  class OceanOrderConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :market_id, ID, required: true
    argument :filter, String, required: false
    argument :after, String, required: false

    type Types::OceanOrderType.connection_type, null: false

    def resolve(params)
      orders = current_user.ocean_orders.where(market_id: params[:market_id])
      case params[:filter]
      when 'booking'
        orders.where(state: %i[booking canceling])
      when 'history'
        orders.where(state: %i[completed refunded])
      else
        orders
      end
    end
  end
end
