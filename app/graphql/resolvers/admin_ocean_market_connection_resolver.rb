# frozen_string_literal: true

module Resolvers
  class AdminOceanMarketConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::OceanMarketType.connection_type, null: false

    def resolve(*)
      OceanMarket.order(turnover: :desc, ocean_orders_count: :desc)
    end
  end
end
