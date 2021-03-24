# frozen_string_literal: true

module Resolvers
  class OceanMarketResolver < Resolvers::BaseResolver
    argument :id, ID, required: false

    type Types::OceanMarketType, null: false

    def resolve(id:)
      markets = current_user&.ocean_markets || OceanMarket.all
      markets.find_by(id: id) || markets.first
    end
  end
end
