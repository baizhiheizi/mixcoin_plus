# frozen_string_literal: true

module Resolvers
  class OceanSnapshotConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :ocean_order_id, ID, required: true

    type Types::MixinNetworkSnapshotType.connection_type, null: false

    def resolve(ocean_order_id:)
      order = current_user.ocean_orders.without_drafted.find(ocean_order_id)
      OceanSnapshot
        .where(source: order)
        .with_snapshot_type(:create_order_from_user, :refund_to_user, :match_to_user)
        .order(transferred_at: :desc)
    end
  end
end
