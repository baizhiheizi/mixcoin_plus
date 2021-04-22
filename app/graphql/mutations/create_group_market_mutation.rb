# frozen_string_literal: true

module Mutations
  class CreateGroupMarketMutation < Mutations::AuthorizedMutation
    argument :quote, String, required: true
    argument :base_asset_id, String, required: true

    type Boolean

    def resolve(quote:, base_asset_id:)
      return unless current_user.mixin_uuid.in?(current_conversation&.admin_uuids || [])

      market = Market.includes(:quote_asset).find_by(quote_asset: { symbol: quote }, base_asset_id: base_asset_id)

      current_conversation.group_markets.create! market: market
    end
  end
end
