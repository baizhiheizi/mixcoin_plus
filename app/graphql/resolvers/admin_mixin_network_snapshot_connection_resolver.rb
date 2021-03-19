# frozen_string_literal: true

module Resolvers
  class AdminMixinNetworkSnapshotConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::MixinNetworkSnapshotType.connection_type, null: false

    def resolve(*)
      MixinNetworkSnapshot.all
    end
  end
end
