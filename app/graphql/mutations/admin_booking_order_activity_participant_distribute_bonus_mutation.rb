# frozen_string_literal: true

module Mutations
  class AdminBookingOrderActivityParticipantDistributeBonusMutation < Mutations::AdminBaseMutation
    argument :participant_id, ID, required: false
    argument :activity_id, ID, required: false

    type Boolean

    def resolve(**params)
      BookingOrderActivityParticipant.find(params[:participant_id]).distribute_bonus! if params[:participant_id].present?
      BookingOrderActivity.find(params[:activity_id]).participants.pending.map(&:distribute_bonus!) if params[:activity_id].present?
    end
  end
end
