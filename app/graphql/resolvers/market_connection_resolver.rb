# frozen_string_literal: true

module Resolvers
  class MarketConnectionResolver < Resolvers::BaseResolver
    argument :type, String, required: true
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::MarketType.connection_type, null: false

    def resolve(params)
      query = params[:query].to_s.strip
      q_ransack = { base_asset_symbol_i_cont: query }

      if current_user.present? && params[:type] == 'favorite'
        current_user.favorite_markets.order_by_default.ransack(q_ransack.merge(m: 'or')).result
      elsif params[:type] == 'hot'
        Market.order(trades_count: :desc, ocean_orders_count: :desc).first(10)
      else
        markets =
          case params[:type]
          when 'USDT'
            Market.where(quote_asset_id: Market::ERC20_USDT_ASSET_ID).order_by_default
          when 'pUSD'
            Market.where(quote_asset_id: Market::PUSD_ASSET_ID).order_by_default
          when 'BTC'
            Market.where(quote_asset_id: Market::BTC_ASSET_ID).order_by_default
          when 'XIN'
            Market.where(quote_asset_id: Market::XIN_ASSET_ID).order_by_default
          when 'recommended'
            Market.recommended
          else
            Market.all
          end

        markets.ransack(q_ransack.merge(m: 'or')).result
      end
    end
  end
end
