# frozen_string_literal: true

module Resolvers
  class IfttbBrokerBalanceResolver < Resolvers::AuthorizedBaseResolver
    argument :user_id, String, required: false

    type [Types::UserAssetType], null: false

    def resolve(**params)
      r = current_user.ifttb_broker.mixin_api.read_assets
      r['data']
    end
  end
end
