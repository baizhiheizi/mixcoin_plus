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
require 'test_helper'

class UserIfttbProfileTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
