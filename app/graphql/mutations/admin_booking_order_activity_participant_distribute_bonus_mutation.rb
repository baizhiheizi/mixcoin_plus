# frozen_string_literal: true

module Mutations
  class AdminBookingOrderActivityParticipantDistributeBonusMutation < Mutations::AdminBaseMutation
    argument :id, ID, required: true

    type Boolean

    def resolve(id:)
      BookingOrderActivityParticipant.find(id).distribute_bonus!
    end
  end
end
