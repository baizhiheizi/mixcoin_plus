# frozen_string_literal: true

module Resolvers
  class AdminMixinNetworkSnapshotConnectionResolver < Resolvers::AdminBaseResolver
    argument :ocean_order_id, ID, required: false
    argument :swap_order_id, ID, required: false
    argument :snapshot_type, String, required: false
    argument :after, String, required: false

    type Types::MixinNetworkSnapshotType.connection_type, null: false

    def resolve(**params)
      snapshots =
        if params[:ocean_order_id].present?
          OceanSnapshot.where(source_id: params[:ocean_order_id])
        elsif params[:swap_order_id].present?
          SwapSnapshot.where(source_id: params[:swap_order_id])
        else
          MixinNetworkSnapshot.all
        end

      snapshot_type = params[:snapshot_type] || 'all'
      snapshots =
        case snapshot_type
        when 'all'
          snapshots
        when 'unprocessed'
          snapshots.unprocessed
        else
          snapshots.where(snapshot_type: snapshot_type)
        end

      snapshots.order(created_at: :desc)
    end
  end
end
