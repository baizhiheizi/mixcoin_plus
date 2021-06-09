# frozen_string_literal: true

module Resolvers
  class AdminBookingOrderSnapshotConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :user_id, ID, required: false
    argument :market_id, ID, required: false
    argument :ocean_order_id, ID, required: false

    type Types::BookingOrderSnapshotType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      snapshots =
        if user.present?
          user.booking_order_snapshots
        else
          BookingOrderSnapshot.all
        end

      snapshots =
        if params[:market_id].present?
          snapshots.where(market_id: params[:market_id])
        else
          snapshots
        end

      snapshots =
        if params[:ocean_order_id].present?
          snapshots.where(ocean_order_id: params[:ocean_order_id])
        else
          snapshots
        end

      snapshots.order(created_at: :desc)
    end
  end
end
