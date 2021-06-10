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
  BONUS_TOTAL_DEFAULT = 0.0001

  belongs_to :market
  belongs_to :bonus_asset, class_name: 'MixinAsset', primary_key: :asset_id

  has_many :participants, class_name: 'BookingOrderActivityParticipant', dependent: :restrict_with_exception
  has_many :booking_order_snapshots, ->(activity) { where('booking_order_snapshots.created_at > ? AND booking_order_snapshots.created_at < ?', activity.started_at, activity.ended_at) }, through: :market

  validates :started_at, presence: true, uniqueness: { scope: :ended_at }
  validates :ended_at, presence: true, uniqueness: { scope: :started_at }
  validates :valid_orders_count, presence: true
  validates :scores_total, presence: true

  before_validation :set_defaults, on: :create

  after_commit :generate_participants, on: :create

  def generate_participants
    booking_order_snapshots.pluck(:user_id).uniq.each do |user_id|
      scores = booking_order_snapshots.where(user_id: user_id).sum(:scores)
      participants.create_with(
        scores: scores,
        bonus: (bonus_total * scores / scores_total).floor(8),
        bonus_asset_id: bonus_asset_id
      ).find_or_create_by(
        user_id: user_id
      )
    end
  end

  private

  def set_defaults
    assign_attributes(
      valid_orders_count: booking_order_snapshots.count,
      scores_total: booking_order_snapshots.sum(:scores)
    )
    self.bonus_total = BONUS_TOTAL_DEFAULT if bonus_total.blank?
  end
end
