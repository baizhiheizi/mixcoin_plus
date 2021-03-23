# frozen_string_literal: true

module Resolvers
  class OceanMarketResolver < Resolvers::AuthorizedBaseResolver
    argument :id, ID, required: false

    type Types::OceanMarketType, null: false

    def resolve(id:)
      current_user.ocean_markets.find_by(id: id) || current_user.ocean_markets.first
    end
  end
end
