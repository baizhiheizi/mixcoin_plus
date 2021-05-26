# frozen_string_literal: true

module MixinNetworkUser::Oceanable
  extend ActiveSupport::Concern

  EXCHANGE_ASSET_ID = '965e5c6e-434c-3fa9-b780-c50f43cd955c'
  EXCHANGE_ASSET_BALANCE = 1
  EXCHANGE_ASSET_AMOUNT = 0.00000001
  OCEAN_ENGINE_USER_ID = 'aaff5bef-42fb-4c9f-90e0-29f69176b7d4'

  included do
    include AASM

    validates :ocean_private_key, presence: true

    after_commit :initialize_broker_account_async, on: :create

    aasm column: :state do
      state :created, initial: true
      state :balanced
      state :ready

      event :balance, after_commit: :initialize_broker_account_async do
        transitions from: :created, to: :balanced
      end

      event :ready do
        transitions from: :balanced, to: :ready
      end
    end
  end

  def balance_ocean_broker
    MixinTransfer.create_with(
      source: self,
      transfer_type: :ocean_broker_balance,
      asset_id: EXCHANGE_ASSET_ID,
      user_id: MixcoinPlusBot.api.client_id,
      opponent_id: mixin_uuid,
      amount: EXCHANGE_ASSET_BALANCE,
      memo: Base64.strict_encode64('OCEAN|BALANCE')
    ).find_or_create_by!(
      trace_id: MixcoinPlusBot.api.unique_conversation_id(mixin_uuid, EXCHANGE_ASSET_ID)
    )
  end

  def register_ocean_broker
    setup_ocean_private_key if ocean_private_key.blank?
    initialize_pin! if pin.blank?

    raise 'Pin incorrect!' unless pin_verified?

    MixinTransfer.create_with(
      source: self,
      wallet: self,
      transfer_type: :ocean_broker_register,
      asset_id: EXCHANGE_ASSET_ID,
      opponent_id: OCEAN_ENGINE_USER_ID,
      amount: EXCHANGE_ASSET_AMOUNT,
      memo: memo_for_registering
    ).find_or_create_by!(
      trace_id: mixin_api.unique_conversation_id(mixin_uuid, OCEAN_ENGINE_USER_ID)
    )
  end

  # market: base + quote
  # state: PENDING | DONE
  def engine_orders(market = nil, state = nil)
    r = Ocean.api.orders ocean_access_token, market: market, state: state

    r['data']
  end

  def initialize_broker_account
    return if ready?

    balance_ocean_broker if created?
    register_ocean_broker if balanced?
  end

  def initialize_broker_account_async
    OceanBrokerInitializeWorker.perform_async id
  end

  def ocean_access_token
    JWT.encode(
      { uid: mixin_uuid },
      OpenSSL::PKey::EC.new(ocean_private_key),
      'ES256'
    )
  end

  def ensure_can_fetch_orders
    engine_orders.is_a?(Array)
  end

  private

  def setup_ocean_private_key
    update! ocean_private_key: OpenSSL::PKey::EC.generate('prime256v1').to_pem
  end

  def memo_for_registering
    Base64.strict_encode64(
      {
        U: Base64.decode64(ocean_public_key)
      }.to_msgpack
    )
  end

  def ocean_public_key
    key = OpenSSL::PKey::EC.new(ocean_private_key)
    pkey = OpenSSL::PKey::EC.new(key.public_key.group)
    pkey.public_key = key.public_key
    pkey.to_pem.gsub(/^-----.*PUBLIC KEY-----$/, '').strip
  end
end
