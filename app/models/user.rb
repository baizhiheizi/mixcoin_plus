# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id         :bigint           not null, primary key
#  avatar_url :string
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
  include Authenticatable

  has_one :mixin_authorization, -> { where(provider: :mixin) }, class_name: 'UserAuthorization', inverse_of: :user

  before_validation :set_profile, on: :create

  validates :mixin_id, presence: true, uniqueness: true
  validates :mixin_uuid, presence: true, uniqueness: true

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
