# frozen_string_literal: true

module Resolvers
  class AdminOceanOrderResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::OceanOrderType, null: false

    def resolve(id:)
      OceanOrder.find(id)
    end
  end
end
