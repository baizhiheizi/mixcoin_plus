# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_snapshots
#
#  id             :uuid             not null, primary key
#  funds          :float
#  order_weight   :float
#  price          :float
#  scores         :float
#  snapshot       :json
#  ticker         :float
#  timestamp      :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  market_id      :uuid
#  ocean_order_id :uuid
#  user_id        :uuid
#
# Indexes
#
#  index_booking_order_snapshots_on_market_id       (market_id)
#  index_booking_order_snapshots_on_ocean_order_id  (ocean_order_id)
#  index_booking_order_snapshots_on_user_id         (user_id)
#
require 'test_helper'

class BookingOrderSnapshotTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
