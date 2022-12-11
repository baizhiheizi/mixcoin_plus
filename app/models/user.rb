# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                 :uuid             not null, primary key
#  assets_synced_at   :datetime
#  avatar_url         :string
#  invitations_count  :integer          default(0)
#  invite_code        :string
#  last_active_at     :datetime
#  locale             :string
#  mixin_uuid         :uuid
#  name               :string
#  ocean_orders_count :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  mixin_id           :string
#
# Indexes
#
#  index_users_on_invite_code  (invite_code) UNIQUE
#  index_users_on_mixin_id     (mixin_id)
#  index_users_on_mixin_uuid   (mixin_uuid) UNIQUE
#
class User < ApplicationRecord
  extend Enumerize

  include Authenticatable
  include Users::Ifttbable

  has_one :mixin_authorization, -> { where(provider: :mixin) }, class_name: 'UserAuthorization', inverse_of: :user, dependent: :restrict_with_exception
  has_one :ifttb_authorization, -> { where(provider: :ifttb) }, class_name: 'UserAuthorization', inverse_of: :user, dependent: :restrict_with_exception
  has_one :broker, as: :owner, dependent: :restrict_with_exception

  has_many :notifications, as: :recipient, dependent: :destroy

  has_many :wallets, class_name: 'MixinNetworkUser', as: :owner, dependent: :restrict_with_exception
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :swap_orders, dependent: :restrict_with_exception
  has_many :assets, class_name: 'UserAsset', dependent: :restrict_with_exception
  has_many :markets, through: :assets, inverse_of: false
  has_many :transfers, class_name: 'MixinTransfer', primary_key: :mixin_uuid, foreign_key: :opponent_id, dependent: :restrict_with_exception, inverse_of: :recipient

  has_one :invitation, foreign_key: :invitee_id, dependent: :restrict_with_exception, inverse_of: :invitee
  has_one :invitor, through: :invitation, source: :invitor
  has_many :invitations, foreign_key: :invitor_id, dependent: :restrict_with_exception, inverse_of: :invitor
  has_many :invitees, -> { order('invitations.created_at desc') }, through: :invitations, source: :invitee
  has_many :booking_order_snapshots, dependent: :restrict_with_exception
  has_many :booking_order_activity_participators, dependent: :restrict_with_exception

  has_many :applets, dependent: :restrict_with_exception
  has_many :applet_activities, through: :applets

  before_validation :set_defaults, on: :create

  validates :mixin_uuid, presence: true, uniqueness: true

  enumerize :locale, in: I18n.available_locales, default: I18n.default_locale

  after_commit :sync_assets_async, :create_brokers_async, :create_contact_conversations, on: :create

  scope :within_24h, -> { where(created_at: (24.hours.ago)...) }

  action_store :favorite, :market

  def access_token
    mixin_authorization&.access_token
  end

  def mixin_assets
    return [] if fennec?

    @mixin_assets ||= MixcoinPlusBot.api.assets(access_token: access_token)&.[]('data') || []
  end

  def sync_assets
    return if assets_synced_at? && Time.current - assets_synced_at < 1.minute

    mixin_assets.each do |_asset|
      asset = assets.includes(:asset).find_by(asset_id: _asset['asset_id'])
      if asset.present?
        asset.update raw: _asset
      else
        assets.create_with(raw: _asset).find_or_create_by(asset_id: _asset['asset_id'])
      end
    end
    update assets_synced_at: Time.current
  end

  def sync_assets_async
    UserSyncAssetsWorker.perform_async id
  end

  def avatar
    avatar_url.presence || generated_avatar_url
  end

  def generated_avatar_url
    format('https://api.multiavatar.com/%<mixin_uuid>s.svg', mixin_uuid: mixin_uuid)
  end

  def snapshots_with_ocean_engine(_snapshots = [], offset = nil)
    r = MixcoinPlusBot.api.snapshots(access_token: access_token, opponent: Broker::OCEAN_ENGINE_USER_ID, limit: 100, offset: offset)
    if r['data'].count == 100
      snapshots_with_ocean_engine(_snapshots + r['data'], r['data'].last['created_at'])
    else
      _snapshots + r['data']
    end
  end

  def deprecated_ocean_orders
    DecryptedDeprecatedOrdersService.new.call snapshots_with_ocean_engine
  end

  def generate_invite_code
    SecureRandom.alphanumeric(10).upcase
  end

  def may_invited?
    ocean_orders.without_drafted.count.zero?
  end

  def create_contact_conversations
    return if fennec?

    MixcoinPlusBot.api.create_contact_conversation mixin_uuid
    IfttbBot.api.create_contact_conversation mixin_uuid
  end

  def fennec?
    mixin_id == '0' || mixin_bot?
  end

  def mixin_bot?
    mixin_id.match?(/^7000\d{6}/)
  end

  def messenger?
    !fennec? && !mixin_bot?
  end

  def log_active
    touch :last_active_at
  end

  def create_brokers_async
    UserCreateBrokersWorker.perform_async id
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      name: mixin_authorization.raw['full_name'],
      avatar_url: mixin_authorization.raw['avatar_url'],
      mixin_id: mixin_authorization.raw['identity_number'],
      mixin_uuid: mixin_authorization.uid,
      invite_code: generate_invite_code
    )
  end
end
