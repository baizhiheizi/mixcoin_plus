# frozen_string_literal: true

module Resolvers
  class AdminMarketConnectionResolver < Resolvers::AdminBaseResolver
    argument :query, String, required: false
    argument :quote_asset_id, String, required: false
    argument :after, String, required: false

    type Types::MarketType.connection_type, null: false

    def resolve(**params)
      markets = Market.all
      markets = markets.where(quote_asset_id: params[:quote_asset_id]) if params[:quote_asset_id].present?

      query = params[:query].to_s.strip
      q_ransack = { base_asset_symbol_i_cont: query }
      markets.ransack(q_ransack.merge(m: 'or')).result
    end
  end
end
