# frozen_string_literal: true

class BookingOrderSnapshotGenerateWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform
    Market.booking_order_activity_enabled.map(&:generate_booking_order_snapshots)
  end
end
