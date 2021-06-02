# frozen_string_literal: true

module Mutations
  class AdminArbitragerWithrawBalanceMutation < Mutations::AdminBaseMutation
    argument :mixin_uuid, ID, required: true
    argument :asset_id, String, required: true

    type Boolean

    def resolve(mixin_uuid:, asset_id:)
      arbitrager = Arbitrager.find_by(mixin_uuid: mixin_uuid)
      return if arbitrager.blank?

      balance = arbitrager.mixin_api.asset(asset_id)['data']['balance']
      MixinTransfer.create!(
        user_id: arbitrager.mixin_uuid,
        transfer_type: :withraw_to_admin,
        opponent_id: Rails.application.credentials[:admin_mixin_uuid],
        asset_id: asset_id,
        amount: balance,
        memo: 'WITHRAW TO OWNER',
        trace_id: SecureRandom.uuid
      )
    end
  end
end
