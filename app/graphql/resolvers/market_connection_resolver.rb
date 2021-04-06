# frozen_string_literal: true

module Resolvers
  class MarketConnectionResolver < Resolvers::BaseResolver
    argument :type, String, required: true
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::MarketType.connection_type, null: false

    def resolve(params)
      markets =
        if current_user.present? && params[:type] == 'favorite'
          current_user.favorite_markets
        elsif params[:type] == 'USDT'
          (current_user&.markets || Market.all).includes(:quote_asset).where(quote_asset_id: Market::ERC20_USDT_ASSET_ID)
        else
          (current_user&.markets || Market.all).includes(:quote_asset).where(quote_asset: { symbol: params[:type] })
        end

      query = params[:query].to_s.strip
      q_ransack = { base_asset_symbol_i_cont: query }
      markets.ransack(q_ransack.merge(m: 'or')).result
    end
  end
end
