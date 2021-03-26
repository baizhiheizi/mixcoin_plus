# frozen_string_literal: true

module Mutations
  class UnfavoriteOceanMarketMutation < Mutations::AuthorizedMutation
    argument :ocean_market_id, ID, required: true

    type Types::OceanMarketType

    def resolve(ocean_market_id:)
      market = OceanMarket.find_by(id: ocean_market_id)
      return if market.blank?

      current_user.destroy_action(:favorite, target: market)

      market.reload
    end
  end
end
