# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_activities
#
#  id             :uuid             not null, primary key
#  bonus_total    :float
#  ended_at       :datetime
#  scores_total   :float
#  started_at     :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  bonus_asset_id :uuid
#  market_id      :uuid
#
# Indexes
#
#  index_booking_order_activities_on_market_id  (market_id)
#
require 'test_helper'

class BookingOrderActivityTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
