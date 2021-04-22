# frozen_string_literal: true

module Mutations
  class DeleteGroupMarketMutation < Mutations::AuthorizedMutation
    argument :market_id, ID, required: true

    type Boolean

    def resolve(market_id:)
      return unless current_user.mixin_uuid.in?(current_conversation&.admin_uuids || [])

      current_conversation.group_markets.find_by(market: market_id)&.destroy!
    end
  end
end
