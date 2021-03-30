# frozen_string_literal: true

module Resolvers
  class MarketResolver < Resolvers::BaseResolver
    argument :id, ID, required: false

    type Types::MarketType, null: false

    def resolve(id:)
      markets = current_user&.markets || Market.all
      markets.find_by(id: id) || markets.first
    end
  end
end
