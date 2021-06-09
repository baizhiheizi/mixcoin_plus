# frozen_string_literal: true

module Resolvers
  class AdminBookingOrderActivityResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::BookingOrderActivityType, null: false

    def resolve(id:)
      BookingOrderActivity.find(id)
    end
  end
end
