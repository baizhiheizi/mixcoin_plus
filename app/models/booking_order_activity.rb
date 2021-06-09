# frozen_string_literal: true

# == Schema Information
#
# Table name: booking_order_activities
#
#  id                 :uuid             not null, primary key
#  bonus_total        :float
#  ended_at           :datetime
#  scores_total       :float
#  started_at         :datetime
#  valid_orders_count :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  bonus_asset_id     :uuid
#  market_id          :uuid
#
# Indexes
#
#  index_booking_order_activities_on_market_id  (market_id)
#
class BookingOrderActivity < ApplicationRecord
  belongs_to :market
  belongs_to :bonus_asset, class_name: 'MixinAsset', primary_key: :asset_id, dependent: :restrict_with_exception

  has_many :participants, class_name: 'BookingOrderActivityParticipant', dependent: :restrict_with_exception
  has_many :booking_order_snapshots, -> { where(created_at: started_at...ended_at) }, through: :market

  validates :started_at, presence: true
  validates :ended_at, presence: true
  validates :valid_orders_count, presence: true
  validates :scores_total, presence: true

  after_commit :generate_participants

  def generate_participants
    booking_order_snapshots.pluck(:user_id).uniq.each do |user_id|
      scores = booking_order_snapshots.where(user_id: user_id).sum(:scores)
      participants.create(
        user_id: user_id,
        scores: scores,
        bonus: bonus_total * scores / scores_total,
        bonus_asset_id: bonus_asset_id
      )
    end
  end
end
