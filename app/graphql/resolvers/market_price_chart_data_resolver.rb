# frozen_string_literal: true

module Resolvers
  class MarketPriceChartDataResolver < Resolvers::BaseResolver
    argument :market_id, ID, required: false
    argument :range, String, required: false

    type GraphQL::Types::JSON, null: false

    def resolve(**params)
      Market.find(params[:market_id]).prices.only_7_days.chart_data
    end
  end
end
