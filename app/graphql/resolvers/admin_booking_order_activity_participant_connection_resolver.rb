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

      participants =
        if params[:market_id].present?
          participants.where(market_id: params[:market_id])
        else
          participants
        end

      participants =
        if params[:booking_order_activity_id].present?
          participants.where(booking_order_activity_id: params[:booking_order_activity_id])
        else
          participants
        end

      participants =
        if params[:state].present?
          participants.where(state: params[:state])
        else
          participants
        end

      snapshots.order(created_at: :desc)
    end
  end
end
