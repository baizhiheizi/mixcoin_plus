# frozen_string_literal: true

module Resolvers
  class OceanMarketConnectionResolver < Resolvers::BaseResolver
    argument :type, String, required: true
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::OceanMarketType.connection_type, null: false

    def resolve(params)
      markets =
        if current_user.present? && params[:type] == 'favorite'
          current_user.favorite_ocean_markets
        else
          (current_user&.ocean_markets || OceanMarket.all).where(quote_asset_symbol: params[:type])
        end
      
      query = params[:query].to_s.strip
      q_ransack = { base_asset_symbol_i_cont_any: query }
      markets.ransack(q_ransack.merge(m: 'or')).result
    end
  end
end