# frozen_string_literal: true

module Mutations
  class AdminUnrecommendMarketMutation < Mutations::AdminBaseMutation
    argument :market_id, ID, required: true

    type Boolean

    def resolve(market_id:)
      Market.find(market_id).unrecommend!
    end
  end
end
