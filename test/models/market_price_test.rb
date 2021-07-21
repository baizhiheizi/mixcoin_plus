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
require 'test_helper'

class MarketPriceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
