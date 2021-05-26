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
class MixinNetworkUser < ApplicationRecord
  DEFAULT_AVATAR_FILE = Rails.application.root.join('app/packs/images/logo.png')

  include Encryptable

  belongs_to :owner, optional: true, inverse_of: false, polymorphic: true
  has_many :snapshots, class_name: 'MixinNetworkSnapshot', foreign_key: :user_id, primary_key: :mixin_uuid, dependent: :nullify, inverse_of: :wallet
  has_many :transfers, class_name: 'MixinTransfer', foreign_key: :user_id, primary_key: :mixin_uuid, dependent: :nullify, inverse_of: :wallet
  has_many :ocean_orders, primary_key: :mixin_uuid, foreign_key: :broker_id, dependent: :restrict_with_exception, inverse_of: :broker

  validates :name, presence: true
  validates :pin_token, presence: true
  validates :private_key, presence: true
  validates :mixin_uuid, presence: true
  validates :session_id, presence: true

  before_validation :setup_attributes, on: :create

  after_commit :update_avatar_async, on: :create

  attr_encrypted :pin

  def mixin_api
    @mixin_api ||= MixinBot::API.new(
      client_id: mixin_uuid,
      client_secret: nil,
      session_id: session_id,
      pin_token: pin_token,
      private_key: private_key
    )
  end

  def pin_verified?
    return if pin.blank?

    r = mixin_api.verify_pin pin
    r['data'].present?
  rescue MixinBot::ResponseError
    false
  end

  def initialize_pin!
    return if pin.present?

    update_pin!
  end

  def update_pin!
    new_pin = SecureRandom.random_number.to_s.split('.').last.first(6)
    with_lock do
      old_pin = pin
      self.pin = new_pin
      r = mixin_api.update_pin(old_pin: old_pin, pin: new_pin)
      raise 'Update pin failed' if r['data'].blank?

      save!
    end
  end

  def sync_profile!
    r = mixin_api.read_me
    update! raw: r['data']
  end

  def update_avatar
    img = File.open DEFAULT_AVATAR_FILE
    r = mixin_api.update_me full_name: name, avatar_base64: Base64.strict_encode64(img.read)
    update raw: r['data'], name: r['data']['full_name'] if r['data'].present?
  ensure
    img.close
  end

  def update_avatar_async
    MixinNetworkUserUpdateAvatarWorker.perform_async id
  end

  def default_name
    'Mixcoin'
  end

  private

  def setup_attributes
    return unless new_record?

    r = MixcoinPlusBot.api.create_user(name || default_name, key_type: 'Ed25519')

    self.raw = r['data']

    assign_attributes(
      mixin_uuid: raw['user_id'],
      name: raw['full_name'],
      pin_token: raw['pin_token'],
      session_id: raw['session_id'],
      private_key: r[:ed25519_key]&.[](:private_key),
      ocean_private_key: OpenSSL::PKey::EC.generate('prime256v1').to_pem
    )
  end
end
