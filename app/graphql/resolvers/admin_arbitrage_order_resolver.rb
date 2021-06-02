# frozen_string_literal: true

module Resolvers
  class AdminArbitrageOrderResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::ArbitrageOrderType, null: false

    def resolve(id:)
      ArbitrageOrder.find(id)
    end
  end
end
