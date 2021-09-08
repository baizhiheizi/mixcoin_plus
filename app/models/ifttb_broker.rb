# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_network_users
#
#  id                  :uuid             not null, primary key
#  encrypted_pin       :string
#  mixin_uuid          :uuid
#  name                :string
#  ocean_private_key   :string
#  owner_type          :string
#  pin_token           :string
#  private_key         :string
#  raw                 :json
#  state               :string
#  type(STI)           :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  owner_id            :uuid
#  session_id          :uuid
#
# Indexes
#
#  index_mixin_network_users_on_mixin_uuid               (mixin_uuid) UNIQUE
#  index_mixin_network_users_on_owner_id_and_owner_type  (owner_id,owner_type)
#
class IfttbBroker < MixinNetworkUser
  DEFAULT_AVATAR_FILE = Rails.application.root.join('app/packs/images/ifttb_logo.png')

  include AASM

  after_initialize :set_default_name, if: :new_record?
  after_commit :initialize_broker_account_async, on: :create

  aasm column: :state do
    state :created, initial: true
    state :ready

    event :ready do
      transitions from: :created, to: :ready
    end
  end

  def initialize_broker_account
    return if ready?

    initialize_pin! if pin.blank?

    raise 'Pin incorrect!' unless pin_verified?

    reload.ready!
  end

  def initialize_broker_account_async
    IfttbBrokerInitializeWorker.perform_async id
  end

  def default_name
    'IFTTB'
  end

  def default_avatar_file
    DEFAULT_AVATAR_FILE
  end

  private

  def set_default_name
    self.name = default_name
  end
end
