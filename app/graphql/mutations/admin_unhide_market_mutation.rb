# frozen_string_literal: true

module Mutations
  class AdminUnhideMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true

    type Boolean

    def resolve(market_id:)
      Market.find(market_id).unhide!
    end
  end
end
