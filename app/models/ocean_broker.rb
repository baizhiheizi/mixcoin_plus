# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_network_users
#
#  id            :bigint           not null, primary key
#  encrypted_pin :string
#  name          :string
#  owner_type    :string
#  pin_token     :string
#  private_key   :string
#  raw           :json
#  uuid          :uuid
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  owner_id      :bigint
#  session_id    :uuid
#
# Indexes
#
#  index_mixin_network_users_on_owner  (owner_type,owner_id)
#  index_mixin_network_users_on_uuid   (uuid) UNIQUE
#
class OceanBroker < MixinNetworkUser
  EXCHANGE_ASSET_ID = '965e5c6e-434c-3fa9-b780-c50f43cd955c'
  EXCHANGE_ASSET_BALANCE = 1
  EXCHANGE_ASSET_AMOUNT = 0.00000001
  OCEAN_ENGINE_USER_ID = 'aaff5bef-42fb-4c9f-90e0-29f69176b7d4'

  include AASM

  belongs_to :user, optional: true, inverse_of: :broker
  has_many :ocean_orders, foreign_key: :broker_id, primary_key: :uuid, dependent: :nullify, inverse_of: :broker

  after_commit :initialize_broker_account_async, on: :create

  aasm column: :state do
    state :created, initial: true
    state :balanced
    state :ready

    event :balance do
      transitions from: :created, to: :balanced
    end

    event :ready do
      transitions from: :balanced, to: :ready
    end
  end

  def initialize_exchange_asset_balance
    r = TransferMixinAssetService.new.call(
      asset_id: EXCHANGE_ASSET_ID,
      opponent_id: uuid,
      amount: EXCHANGE_ASSET_BALANCE,
      trace_id: MixcoinPlusBot.api.unique_conversation_id(uuid, EXCHANGE_ASSET_ID),
      memo: 'Initial asset for broker'
    )

    raise r.inspect if r['error'].present?

    balance! if r['data'].present? && created?
  end

  def register_ocean
    setup_ocean_private_key if ocean_private_key.blank?
    update_pin! if pin.blank?

    create_transfer_to_ocean(
      memo_for_registering,
      trace_id: mixin_api.unique_conversation_id(uuid, OCEAN_ENGINE_USER_ID)
    )

    ready! if engine_orders.is_a?(Array) && balanced?
  end

  # market: base + quote
  # state: PENDING | DONE
  def engine_orders(market = nil, state = nil)
    r = Ocean.api.orders ocean_access_token, market: market, state: state

    r['data']
  end

  def create_transfer_to_ocean(memo, trace_id: nil, asset_id: nil, amount: nil)
    mixin_api.create_transfer(
      reload.pin,
      {
        asset_id: asset_id || EXCHANGE_ASSET_ID,
        opponent_id: OCEAN_ENGINE_USER_ID,
        amount: amount || EXCHANGE_ASSET_AMOUNT,
        trace_id: trace_id || SecureRandom.uuid,
        memo: memo
      }
    )
  end

  def create_transfer_to_user(memo, asset_id:, amount:, trace_id: nil)
    mixin_api.create_transfer(
      pin,
      {
        asset_id: asset_id,
        opponent_id: user.mixin_uuid,
        amount: amount,
        trace_id: trace_id || SecureRandom.uuid,
        memo: memo
      }
    )
  end

  def initialize_broker_account
    return if ready?

    initialize_exchange_asset_balance if created?
    register_ocean if balanced?

    raise 'Not ready yet!' unless reload.ready?
  end

  def initialize_broker_account_async
    InitializeMixinNetworkBrokerWorker.perform_async id
  end

  def ocean_access_token
    JWT.encode(
      { uid: uuid },
      OpenSSL::PKey::EC.new(ocean_private_key),
      'ES256'
    )
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
