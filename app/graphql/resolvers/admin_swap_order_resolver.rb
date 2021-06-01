# frozen_string_literal: true

module Resolvers
  class AdminSwapOrderResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::SwapOrderType, null: false

    def resolve(id:)
      SwapOrder.find(id)
    end
  end
end
