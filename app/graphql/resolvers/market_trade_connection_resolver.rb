# frozen_string_literal: true

module Resolvers
  class MarketTradeConnectionResolver < Resolvers::BaseResolver
    argument :market_id, ID, required: true
    argument :after, String, required: false

    type Types::TradeType.connection_type, null: false

    def resolve(**params)
      Market.find(params[:market_id]).trades.order(traded_at: :desc)
    end
  end
end
