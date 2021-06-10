# frozen_string_literal: true

module Mutations
  class AdminHideMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true

    type Boolean

    def resolve(market_id:)
      Market.find(market_id).hide!
    end
  end
end
