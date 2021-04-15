# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                :uuid             not null, primary key
#  assets_synced_at  :datetime
#  avatar_url        :string
#  invitations_count :integer          default(0)
#  invite_code       :string
#  locale            :string
#  mixin_uuid        :uuid
#  name              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  mixin_id          :string
#
# Indexes
#
#  index_users_on_invite_code  (invite_code) UNIQUE
#  index_users_on_mixin_id     (mixin_id) UNIQUE
#  index_users_on_mixin_uuid   (mixin_uuid) UNIQUE
#
class User < ApplicationRecord
  extend Enumerize

  include Authenticatable

  has_one :mixin_authorization, -> { where(provider: :mixin) }, class_name: 'UserAuthorization', inverse_of: :user

  has_many :notifications, as: :recipient, dependent: :destroy

  has_many :wallets, class_name: 'MixinNetworkUser', as: :owner, dependent: :restrict_with_exception
  has_one :ocean_broker, class_name: 'OceanBroker', as: :owner, dependent: :restrict_with_exception
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :assets, class_name: 'UserAsset', dependent: :restrict_with_exception
  has_many :markets, through: :assets, inverse_of: false
  has_many :transfers, class_name: 'MixinTransfer', dependent: :restrict_with_exception, inverse_of: :recipient

  has_one :invitation, foreign_key: :invitee_id, dependent: :restrict_with_exception, inverse_of: :invitee
  has_one :invitor, through: :invitation, source: :invitor
  has_many :invitations, foreign_key: :invitor_id, dependent: :restrict_with_exception, inverse_of: :invitor
  has_many :invitees, through: :invitations, source: :invitee

  before_validation :set_defaults, on: :create

  validates :mixin_id, presence: true, uniqueness: true
  validates :mixin_uuid, presence: true, uniqueness: true

  enumerize :locale, in: I18n.available_locales, default: I18n.default_locale

  after_commit :sync_assets_async, :create_ocean_broker, on: :create

  delegate :access_token, to: :mixin_authorization

  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }

  action_store :favorite, :market

  def mixin_assets
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
    avatar_url || generated_avatar_url
  end

  def generated_avatar_url
    format('https://api.multiavatar.com/%<mixin_uuid>s.svg', mixin_uuid: mixin_uuid)
  end

  def snapshots_with_ocean_engine(_snapshots = [], offset = nil)
    r = MixcoinPlusBot.api.snapshots(access_token: access_token, opponent: OceanBroker::OCEAN_ENGINE_USER_ID, limit: 100, offset: offset)
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
