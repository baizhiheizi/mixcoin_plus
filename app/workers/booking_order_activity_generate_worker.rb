# frozen_string_literal: true

class BookingOrderActivityGenerateWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform
    Market.booking_order_activity_enabled.map(&:generate_booking_activity)
  end
end
