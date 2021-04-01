# frozen_string_literal: true

module Resolvers
  class DeprecatedOceanOrdersResolver < Resolvers::AuthorizedBaseResolver
    type [Types::OceanOrderType], null: false

    def resolve(**_params)
      current_user.deprecated_ocean_orders
    end
  end
end
