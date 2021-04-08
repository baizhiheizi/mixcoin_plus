# frozen_string_literal: true

module Resolvers
  class UserAssetsResolver < Resolvers::AuthorizedBaseResolver
    type [Types::UserAssetType], null: false

    def resolve
      current_user.sync_assets_async
      assets =
        current_user.mixin_assets.map do |asset|
          UserAsset.new asset_id: asset['asset_id'], raw: asset
        end
      assets.sort_by { |asset| -asset.balance_usd }
    end
  end
end
