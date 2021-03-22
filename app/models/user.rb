# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id         :bigint           not null, primary key
#  avatar_url :string
#  locale     :string
#  mixin_uuid :uuid
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  mixin_id   :string
#
# Indexes
#
#  index_users_on_mixin_id    (mixin_id) UNIQUE
#  index_users_on_mixin_uuid  (mixin_uuid) UNIQUE
#
class User < ApplicationRecord
  extend Enumerize

  include Authenticatable

  has_one :mixin_authorization, -> { where(provider: :mixin) }, class_name: 'UserAuthorization', inverse_of: :user
  has_many :notifications, as: :recipient, dependent: :destroy
  has_many :wallets, class_name: 'MixinNetworkUser', as: :owner, dependent: :restrict_with_exception
  has_one :ocean_broker, class_name: 'OceanBroker', as: :owner, dependent: :restrict_with_exception

  before_validation :set_profile, on: :create

  validates :mixin_id, presence: true, uniqueness: true
  validates :mixin_uuid, presence: true, uniqueness: true

  enumerize :locale, in: I18n.available_locales, default: I18n.default_locale

  def avatar
    avatar_url || generated_avatar_url
  end

  def generated_avatar_url
    format('https://api.multiavatar.com/%<mixin_uuid>s.svg', mixin_uuid: mixin_uuid)
  end

  private

  def set_profile
    assign_attributes(
      name: mixin_authorization.raw['full_name'],
      avatar_url: mixin_authorization.raw['avatar_url'],
      mixin_id: mixin_authorization.raw['identity_number'],
      mixin_uuid: mixin_authorization.uid
    )
  end
end
