# frozen_string_literal: true

module Resolvers
  class UserSnapshotsResolver < Resolvers::AuthorizedBaseResolver
    argument :offset, String, required: false
    argument :asset, String, required: false
    argument :opponent, String, required: false

    type [Types::MixinNetworkSnapshotType], null: false

    def resolve(**params)
      r =
        MixcoinPlusBot
        .api
        .snapshots(
          limit: 50,
          access_token: current_user.access_token,
          offset: params[:offset],
          asset: params[:asset],
          opponent: params[:opponent]
        )
      r['data']
    end
  end
end
