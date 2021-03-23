# frozen_string_literal: true

module Resolvers
  class OceanMarketConnectionResolver < Resolvers::BaseResolver
    argument :type, String, required: true
    argument :after, String, required: false

    type Types::OceanMarketType.connection_type, null: false

    def resolve(params)
      if current_user.present?
        current_user.ocean_markets.where(quote_asset_symbol: params[:type])
      else
        OceanMarket.where(quote_asset_symbol: params[:type])
      end
    end
  end
end
