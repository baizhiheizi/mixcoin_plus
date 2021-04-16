# frozen_string_literal: true

module Resolvers
  class AdminTradeConnectionResolver < Resolvers::AdminBaseResolver
    argument :market_id, ID, required: false
    argument :after, String, required: false

    type Types::TradeType.connection_type, null: false

    def resolve(**params)
      trades =
        if params[:market_id]
          Market.find(params[:market_id]).trades
        else
          Trade.all
        end

      trades.order(traded_at: :desc)
    end
  end
end
