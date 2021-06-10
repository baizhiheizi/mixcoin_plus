# frozen_string_literal: true

module Mutations
  class AdminRankMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true
    argument :position, String, required: true

    type Boolean

    def resolve(market_id:, position:)
      market = Market.find(market_id)

      case position
      when 'top'
        market.move_to_top
      when 'bottom'
        market.move_to_bottom
      when 'higher'
        market.move_higher
      when 'lower'
        market.move_lower
      end
    end
  end
end
