# frozen_string_literal: true

module Resolvers
  class AdminBookingOrderSnapshotConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :user_id, ID, required: false
    argument :market_id, ID, required: false
    argument :ocean_order_id, ID, required: false
    argument :started_at, String, required: false
    argument :ended_at, String, required: false

    type Types::BookingOrderSnapshotType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:user_id])
      snapshots =
        if user.present?
          user.booking_order_snapshots
        else
          BookingOrderSnapshot.all
        end

      snapshots = snapshots.where(market_id: params[:market_id]) if params[:market_id].present?

      snapshots = snapshots.where(ocean_order_id: params[:ocean_order_id]) if params[:ocean_order_id].present?

      snapshots = snapshots.where(created_at: Time.zone.parse(params[:started_at])...Time.zone.parse(params[:ended_at])) if params[:started_at].present? && params[:ended_at].present?

      snapshots.order(created_at: :desc)
    end
  end
end
