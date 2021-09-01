# frozen_string_literal: true

module Resolvers
  class AdminSwapOrderConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :query, String, required: false
    argument :state, String, required: false
    argument :user_id, ID, required: false
    argument :broker_id, ID, required: false
    argument :arbitrage_order_id, ID, required: false
    argument :applet_id, ID, required: false

    type Types::SwapOrderType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      broker = MixinNetworkUser.find_by(mixin_uuid: params[:broker_id])
      arbitrage_order = ArbitrageOrder.find_by(id: params[:arbitrage_order_id])
      applet = Applet.with_archived.find_by(id: params[:applet_id])
      orders =
        if user.present?
          user.swap_orders
        elsif broker.present?
          broker.swap_orders
        elsif arbitrage_order.present?
          arbitrage_order.swap_orders
        elsif applet.present?
          applet.swap_orders
        else
          SwapOrder.all
        end

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
      orders.ransack(q_ransack.merge(m: 'or')).result.order(created_at: :desc)
    end
  end
end
