# frozen_string_literal: true

module Resolvers
  class MarketResolver < Resolvers::BaseResolver
    argument :id, ID, required: false
    argument :quote_asset_id, String, required: false
    argument :base_asset_id, String, required: false

    type Types::MarketType, null: false

    def resolve(**params)
      markets = Market.all

      market =
        if params[:id].present?
          markets.find_by(id: params[:id])
        elsif params[:quote_asset_id].present? && params[:base_asset_id].present?
          markets.find_by(quote_asset_id: params[:quote_asset_id], base_asset_id: params[:base_asset_id])
        end

      market ||= markets.recommended.sample
      market.sync_trades_from_engine_async

      market
    end
  end
end
