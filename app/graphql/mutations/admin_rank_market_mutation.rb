# frozen_string_literal: true

module Mutations
  class AdminRankMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true
    argument :position, String, required: true

    type Boolean

    def resolve(market_id:, position:)
      market = Market.find(market_id)

      case position
      when 'first'
        market.move_to_top
      when 'last'
        market.move_to_bottom
      when 'up'
        market.move_higher
      when 'down'
        market.move_lower
      end
    end
  end
end
