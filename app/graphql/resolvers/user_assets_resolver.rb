# frozen_string_literal: true

module Resolvers
  class UserAssetsResolver < Resolvers::AuthorizedBaseResolver
    type [Types::UserAssetType], null: false

    def resolve
      current_user.sync_assets
      current_user.assets.order(balance_usd: :desc, balance: :desc)
    end
  end
end
