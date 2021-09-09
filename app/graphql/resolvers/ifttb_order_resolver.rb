# frozen_string_literal: true

module Resolvers
  class IfttbOrderResolver < Resolvers::AuthorizedBaseResolver
    argument :id, ID, required: false

    type Types::IfttbOrderType, null: false

    def resolve(id:)
      current_user.ifttb_orders.find_by id: id
    end
  end
end
