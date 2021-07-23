# frozen_string_literal: true

class BookingOrderActivityParticipantsGenerateWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(id)
    BookingOrderActivity.find(id).generate_participants
  end
end
