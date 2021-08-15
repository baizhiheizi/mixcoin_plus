# frozen_string_literal: true

module Resolvers
  class AdminArbitrageOrderConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :state, String, required: false
    argument :market_id, ID, required: false
    argument :arbitrager_id, ID, required: false

    type Types::ArbitrageOrderType.connection_type, null: false

    def resolve(**params)
      arbitrager = Arbitrager.find_by(mixin_uuid: params[:arbitrager_id])
      orders =
        if arbitrager.present?
          arbitrager.arbitrage_orders
        else
          ArbitrageOrder.all
        end

      orders =
        (orders.where(market_id: params[:market_id]) if params[:market_id].present?)

      state = params[:state] || 'valid'
      orders =
        case state
        when 'all'
          orders
        when 'valid'
          orders.without_drafted
        else
          orders.where(state: params[:state])
        end

      orders.order(created_at: :desc)
    end
  end
end
