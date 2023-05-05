# frozen_string_literal: true

module Resolvers
  class IfttbBrokerBalanceResolver < Resolvers::AuthorizedBaseResolver
    argument :user_id, String, required: false

    type [Types::UserAssetType], null: false

    def resolve(**_params)
      current_user.create_ifttb_broker! if current_user.ifttb_broker.blank?

      r = current_user.ifttb_broker.mixin_api.read_assets
      r['data']
    end
  end
end
