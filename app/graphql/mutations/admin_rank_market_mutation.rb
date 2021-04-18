# frozen_string_literal: true

module Mutations
  class AdminRankMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true
    argument :position, String, required: true

    type Boolean

    def resolve(market_id:, position:)
      Market.find(market_id).update rank_position: position
    end
  end
end
