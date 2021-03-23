# frozen_string_literal: true

module Mutations
  class CancelOceanOrderMutation < Mutations::AuthorizedMutation
    argument :id, ID, required: true

    type Types::OceanOrderType

    def resolve(id:)
      order = current_user.ocean_orders.find(id)
      order.cancel! if order.may_cancel?

      order
    end
  end
end
