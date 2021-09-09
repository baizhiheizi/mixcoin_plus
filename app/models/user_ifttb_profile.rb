# frozen_string_literal: true

# == Schema Information
#
# Table name: user_ifttb_profiles
#
#  id             :uuid             not null, primary key
#  pro_expired_at :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :string           not null
#
# Indexes
#
#  index_user_ifttb_profiles_on_user_id  (user_id)
#
class UserIfttbProfile < ApplicationRecord
  extend Enumerize

  belongs_to :user, inverse_of: :ifttb_profile

  def role
    pro_expired_at.present? && pro_expired_at > Time.current ? :pro : :free
  end

  def free?
    role == :free
  end

  def pro?
    role == :pro
  end

  def upgrade_pro(period = 1.year)
    update(
      pro_expired_at: (pro_expired_at.blank? || pro_expired_at < Time.current ? Time.current : pro_expired_at) + period
    )
  end
end
