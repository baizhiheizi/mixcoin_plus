# frozen_string_literal: true

module Resolvers
  class UserAssetResolver < Resolvers::AuthorizedBaseResolver
    argument :asset_id, String, required: true

    type Types::UserAssetType, null: false

    def resolve(**params)
      current_user.sync_assets_async
      current_user.assets.find_by asset_id: params[:asset_id]
    end
  end
end
