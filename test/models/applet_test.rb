# frozen_string_literal: true

# == Schema Information
#
# Table name: applets
#
#  id                      :uuid             not null, primary key
#  applet_activities_count :integer          default(0)
#  archived_at             :datetime
#  connected               :boolean          default(FALSE)
#  last_active_at          :datetime
#  state                   :string
#  title                   :string
#  type                    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :uuid             not null
#
require 'test_helper'

class AppletTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
