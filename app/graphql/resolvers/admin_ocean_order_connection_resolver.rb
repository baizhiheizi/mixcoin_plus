# frozen_string_literal: true

module Resolvers
  class AdminOceanOrderConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :query, String, required: false
    argument :state, String, required: false
    argument :conversation_id, ID, required: false
    argument :market_id, ID, required: false
    argument :user_id, ID, required: false
    argument :broker_id, ID, required: false
    argument :arbitrage_order_id, ID, required: false

    type Types::OceanOrderType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      broker = MixinNetworkUser.find_by(mixin_uuid: params[:broker_id])
      arbitrage_order = ArbitrageOrder.find_by(id: params[:arbitrage_order_id])
      orders =
        if user.present?
          user.ocean_orders
        elsif broker.present?
          broker.ocean_orders
        elsif arbitrage_order.present?
          arbitrage_order.ocean_orders
        else
          OceanOrder.all
        end

      orders = orders.where(market_id: params[:market_id]) if params[:market_id].present?

      orders = orders.where(conversation_id: params[:conversation_id]) if params[:conversation_id].present?

      state = params[:state] || 'valid'
      orders =
        case state
        when 'valid'
          orders.without_drafted
        else
          orders.where(state: params[:state])
        end

      query = params[:query].to_s.strip
      q_ransack = { trace_id_eq: query }
      orders.ransack(q_ransack.merge(m: 'or')).result.order(updated_at: :desc)
    end
  end
end
