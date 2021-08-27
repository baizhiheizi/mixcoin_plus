# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_activities
#
#  id               :uuid             not null, primary key
#  state            :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  applet_action_id :uuid             not null
#
# Indexes
#
#  index_applet_activities_on_applet_action_id  (applet_action_id)
#
require 'test_helper'

class AppletActivityTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
