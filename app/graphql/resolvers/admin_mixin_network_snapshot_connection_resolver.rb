# frozen_string_literal: true

module Resolvers
  class AdminMixinNetworkSnapshotConnectionResolver < Resolvers::AdminBaseResolver
    argument :ocean_order_id, ID, required: false
    argument :after, String, required: false

    type Types::MixinNetworkSnapshotType.connection_type, null: false

    def resolve(**params)
      if params[:ocean_order_id].present?
        OceanSnapshot.where(source_id: params[:ocean_order_id]).order(created_at: :desc)
      else
        MixinNetworkSnapshot.all.order(created_at: :desc)
      end
    end
  end
end
