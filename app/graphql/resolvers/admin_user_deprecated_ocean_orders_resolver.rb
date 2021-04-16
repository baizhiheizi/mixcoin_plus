# frozen_string_literal: true

module Resolvers
  class AdminUserDeprecatedOceanOrdersResolver < Resolvers::AdminBaseResolver
    argument :user_id, ID, required: true

    type [Types::OceanOrderType], null: false

    def resolve(**params)
      User.find(params[:user_id]).deprecated_ocean_orders
    end
  end
end
