# frozen_string_literal: true

# == Schema Information
#
# Table name: applets
#
#  id             :uuid             not null, primary key
#  archived_at    :datetime
#  connected      :boolean          default(FALSE)
#  frequency      :integer          default(300)
#  last_active_at :datetime
#  title          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid             not null
#
require 'test_helper'

class AppletTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
