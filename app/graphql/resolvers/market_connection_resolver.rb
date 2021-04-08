# frozen_string_literal: true

module Resolvers
  class MarketConnectionResolver < Resolvers::BaseResolver
    argument :type, String, required: true
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::MarketType.connection_type, null: false

    def resolve(params)
      markets =
        case params[:type]
        when 'favorite'
          current_user&.favorite_markets
        when 'USDT'
          (current_user&.markets || Market.all).where(quote_asset_id: Market::ERC20_USDT_ASSET_ID)
        when 'pUSD'
          (current_user&.markets || Market.all).where(quote_asset_id: Market::PUSD_ASSET_ID)
        when 'BTC'
          (current_user&.markets || Market.all).where(quote_asset_id: Market::BTC_ASSET_ID)
        when 'XIN'
          (current_user&.markets || Market.all).where(quote_asset_id: Market::XIN_ASSET_ID)
        end

      query = params[:query].to_s.strip
      q_ransack = { base_asset_symbol_i_cont: query }
      markets&.ransack(q_ransack.merge(m: 'or'))&.result || []
    end
  end
end
