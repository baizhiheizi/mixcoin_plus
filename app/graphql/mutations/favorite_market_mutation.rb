# frozen_string_literal: true

module Mutations
  class FavoriteMarketMutation < Mutations::AuthorizedMutation
    argument :market_id, ID, required: true

    type Types::MarketType

    def resolve(market_id:)
      market = Market.find_by(id: market_id)
      return if market.blank?

      current_user.create_action(:favorite, target: market)

      market.reload
    end
  end
end
