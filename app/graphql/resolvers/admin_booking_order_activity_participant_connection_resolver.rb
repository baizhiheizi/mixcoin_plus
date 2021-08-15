# frozen_string_literal: true

module Resolvers
  class AdminBookingOrderActivityParticipantConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :state, String, required: false
    argument :booking_order_activity_id, ID, required: false
    argument :user_id, ID, required: false
    argument :market_id, ID, required: false

    type Types::BookingOrderActivityParticipantType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      participants =
        if user.present?
          user.booking_order_activity_participants
        else
          BookingOrderActivityParticipant.all
        end

      participants = participants.where(market_id: params[:market_id]) if params[:market_id].present?

      participants = participants.where(booking_order_activity_id: params[:booking_order_activity_id]) if params[:booking_order_activity_id].present?

      participants = participants.where(state: params[:state]) if params[:state].present?

      participants.order(created_at: :desc)
    end
  end
end
