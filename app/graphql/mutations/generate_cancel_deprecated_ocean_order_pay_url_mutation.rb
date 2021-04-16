# frozen_string_literal: true

module Mutations
  class GenerateCancelDeprecatedOceanOrderPayUrlMutation < Mutations::AuthorizedMutation
    argument :trace_id, String, required: true

    type String

    def resolve(trace_id:)
      format(
        'mixin://pay?recipient=%<recipient>s&asset=%<asset>s&amount=%<amount>s&memo=%<memo>s&trace=%<trace>s',
        recipient: OceanBroker::OCEAN_ENGINE_USER_ID,
        asset: OceanBroker::EXCHANGE_ASSET_ID,
        amount: OceanBroker::EXCHANGE_ASSET_AMOUNT,
        memo: Base64.urlsafe_encode64(
          {
            O: trace_id.split('-').pack('H* H* H* H* H*')
          }.to_msgpack
        ),
        trace: SecureRandom.uuid
      )
    end
  end
end
