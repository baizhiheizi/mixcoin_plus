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
class BookingOrderSnapshot < ApplicationRecord
  ALPHA_CONST = 25
  N_CONST = 2

  belongs_to :user
  belongs_to :market
  belongs_to :ocean_order

  before_validation :set_defaults, on: :create

  validates :price, presence: true
  validates :order_weight, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :timestamp, presence: true, uniqueness: { scope: :ocean_order_id }

  validate :ensure_price_valid

  def calculate_order_weight
    (1 - ((price / ticker - 1).abs / (ALPHA_CONST / 100.0)))**N_CONST
  end

  def calculate_scores
    calculate_order_weight * funds
  end

  private

  def set_defaults
    assign_attributes(
      price: snapshot['price'],
      funds: snapshot['side'] == 'bid' ? snapshot['remaining_funds'].to_f : snapshot['remaining_amount'].to_f * snapshot['price'].to_f,
      ticker: market.reference_price
    )

    self.order_weight = calculate_order_weight
    self.scores = calculate_scores
  end

  def ensure_price_valid
    errors.add(:price, ' not valid') if (1 - price / ticker).abs > ALPHA_CONST / 100.0
  end
end
