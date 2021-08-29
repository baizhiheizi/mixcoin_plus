# frozen_string_literal: true

module Resolvers
  class IfttbBrokerSnapshotsResolver < Resolvers::AuthorizedBaseResolver
    argument :offset, String, required: false
    argument :asset, String, required: false
    argument :opponent, String, required: false

    type [Types::MixinNetworkSnapshotType], null: false

    def resolve(**params)
      r =
        current_user
        .ifttb_broker
        .mixin_api
        .snapshots(
          limit: 50,
          offset: params[:offset],
          asset: params[:asset],
          opponent: params[:opponent]
        )
      r['data']
    end
  end
end
