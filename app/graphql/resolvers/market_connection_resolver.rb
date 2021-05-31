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

      case params[:type]
      when 'favorite'
        return [] if current_user.blank?

        current_user.favorite_markets.without_hidden.order_by_default.ransack(q_ransack.merge(m: 'or')).result
      when 'hot'
        Market.without_hidden.where.not(quote_asset_id: Market::OMNI_USDT_ASSET_ID).order(trades_count: :desc, ocean_orders_count: :desc).first(10)
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
            if current_conversation&.group?
              current_conversation.markets
            else
              Market.recommended
            end
          else
            Market.order_by_default
          end

        markets.without_hidden.ransack(q_ransack.merge(m: 'or')).result
      end
    end
  end
end
