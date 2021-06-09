# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_activity_participants
#
#  id                        :uuid             not null, primary key
#  bonus                     :float
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
class BookingOrderActivityParticipant < ApplicationRecord
  belongs_to :user
  belongs_to :booking_order_activity
  belongs_to :bonus_asset, class_name: 'MixinAsset', primary_key: :asset_id 
end
