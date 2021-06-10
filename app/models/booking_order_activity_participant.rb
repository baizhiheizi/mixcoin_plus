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
  include AASM

  belongs_to :user
  belongs_to :booking_order_activity
  belongs_to :bonus_asset, class_name: 'MixinAsset', primary_key: :asset_id

  validates :user_id, uniqueness: { scope: :booking_order_activity_id }

  delegate :scores_total, to: :booking_order_activity

  aasm column: :state do
    state :pending, initial: true
    state :distributing
    state :distributed

    event :distribute do
      transitions from: :pending, to: :distributing
    end

    event :complete do
      transitions from: :pending, to: :distributed
      transitions from: :distributing, to: :distributed
    end
  end

  def scores_ratio
    scores / scores_total
  end

  def distribute_bonus!
    ActiveRecord::Base.transaction do
      MixinTransfer.create_with(
        source: self,
        transfer_type: :booking_order_activity_bonus,
        user_id: MixcoinPlusBot.api.client_id,
        opponent_id: user.mixin_uuid,
        asset_id: bonus_asset_id,
        amount: bonus.floor(8),
        memo: "Bonus(#{booking_order_activity.started_at.strftime('%Y-%m-%d')})"
      ).find_or_create_by!(
        trace_id: id
      )
      distribute!
    end
  end
end
