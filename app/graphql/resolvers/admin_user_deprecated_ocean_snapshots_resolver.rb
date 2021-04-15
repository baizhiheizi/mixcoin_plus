# frozen_string_literal: true

module Resolvers
  class AdminUserDeprecatedOceanSnapshotsResolver < Resolvers::AdminBaseResolver
    argument :user_id, ID, required: true

    type [Types::MixinNetworkSnapshotType], null: false

    def resolve(**params)
      user = User.find_by id: params[:user_id]
      user.snapshots_with_ocean_engine.map do |snapshot|
        MixinNetworkSnapshot.new raw: snapshot
      end
    end
  end
end
