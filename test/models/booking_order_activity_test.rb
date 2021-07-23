# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_activities
#
#  id                 :uuid             not null, primary key
#  avg_funds          :float
#  bonus_total        :float
#  ended_at           :datetime
#  participants_count :integer
#  scores_total       :float
#  started_at         :datetime
#  traded_amount      :float
#  traded_funds       :float
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  bonus_asset_id     :uuid
#  market_id          :uuid
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
