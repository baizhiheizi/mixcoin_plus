# frozen_string_literal: true

# == Schema Information
#
# Table name: user_ifttb_profiles
#
#  id             :uuid             not null, primary key
#  pro_expired_at :datetime
#  role           :string
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

  enumerize :role, in: %i[free pro], default: :free, predicates: true

  belongs_to :user, inverse_of: :ifttb_profile

  def upgrade_pro(period = 1.year)
    update(
      role: :pro,
      pro_expired_at: (pro_expired_at.blank? || pro_expired_at < Time.current ? Time.current : pro_expired_at) + period
    )
  end

  def expire_pro
    return if free?
    return if pro_expired_at && pro_expired_at > Time.current

    update role: :free
  end
end
