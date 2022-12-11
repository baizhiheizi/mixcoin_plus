# frozen_string_literal: true

# == Schema Information
#
# Table name: market_prices
#
#  id         :uuid             not null, primary key
#  price      :float
#  time       :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  market_id  :uuid
#
# Indexes
#
#  index_market_prices_on_market_id  (market_id)
#  index_market_prices_on_time       (time)
#
class MarketPrice < ApplicationRecord
  belongs_to :market

  validates :price, numericality: { greater_than_or_equal_to: 0.0 }
  validates :time, presence: true

  default_scope -> { order(time: :asc) }
  scope :only_7_days, -> { where(time: (7.days.ago)...) }
  scope :chart_data, -> { map(&->(item) { [item.time.to_i * 1000, item.price] }) }
end
