# frozen_string_literal: true

module Resolvers
  class AdminIfttbOrderConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :state, String, required: false
    argument :user_id, ID, required: false

    type Types::IfttbOrderType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      orders =
        if user.present?
          user.ifttb_orders
        else
          IfttbOrder.all
        end

      orders =
        case params[:state]
        when 'drafted'
          orders.drafted
        when 'paid'
          orders.paid
        when 'completed'
          orders.completed
        else
          orders
        end

      orders.order(created_at: :desc)
    end
  end
end
