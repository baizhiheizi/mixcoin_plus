# frozen_string_literal: true

module Resolvers
  class OceanOrderResolver < Resolvers::AuthorizedBaseResolver
    argument :id, ID, required: true

    type Types::OceanOrderType, null: false

    def resolve(id:)
      current_user.ocean_orders.without_drafted.find(id)
    end
  end
end
