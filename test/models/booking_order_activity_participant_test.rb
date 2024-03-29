# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_activity_participants
#
#  id                        :uuid             not null, primary key
#  bonus                     :float            default(0.0)
#  scores                    :float
#  state                     :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  bonus_asset_id            :uuid
#  booking_order_activity_id :uuid
#  user_id                   :uuid
#
# Indexes
#
#  index_booking_order_activity_participants_on_user_id  (user_id)
#  participants_on_booking_order_activities_fk           (booking_order_activity_id)
#
require 'test_helper'

class BookingOrderActivityParticipantTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
