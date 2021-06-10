# frozen_string_literal: true

module Resolvers
  class AdminBookingOrderActivityConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :market_id, ID, required: false

    type Types::BookingOrderActivityType.connection_type, null: false

    def resolve(**params)
      activities = BookingOrderActivity.all

      activities =
        if params[:market_id].present?
          activities.where(market_id: params[:market_id])
        else
          activities
        end

      activities.order(created_at: :desc)
    end
  end
end
