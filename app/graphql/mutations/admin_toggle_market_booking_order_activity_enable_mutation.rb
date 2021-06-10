# frozen_string_literal: true

module Mutations
  class AdminToggleMarketBookingOrderActivityEnableMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true

    type Boolean

    def resolve(market_id:)
      Market.find(market_id).toggle_booking_order_activity_enable!
    end
  end
end
