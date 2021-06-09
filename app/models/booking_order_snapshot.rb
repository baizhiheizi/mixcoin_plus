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
  ALPHA_CONST = 2
  N_CONST = 4

  belongs_to :user
  belongs_to :market
  belongs_to :ocean_order

  before_validation :set_defaults, on: :create

  validates :price, presence: true
  validates :order_weight, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :timestamp, presence: true, uniqueness: true

  validate :ensure_price_valid

  private

  def set_defaults
    assign_attributes(
      price: snapshot['price'],
      funds: snapshot['remaining_funds'],
      ticker: market.price_current
    )

    self.order_weight = (1 - ((price / ticker).abs / ALPHA_CONST).to_f / 100.0)**N_CONST
    self.scores = order_weight * price
  end

  def ensure_price_valid
    errors.add(:price, ' not valid') if (1 - price / ticker).abs > ALPHA_CONST.to_f / 100
  end
end
