# frozen_string_literal: true

module Resolvers
  class AdminOceanOrderConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::OceanOrderType.connection_type, null: false

    def resolve(*)
      OceanOrder.all.order(created_at: :desc)
    end
  end
end
