# frozen_string_literal: true

module Resolvers
  class AdminMarketResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::MarketType, null: false

    def resolve(id:)
      Market.find id
    end
  end
end
