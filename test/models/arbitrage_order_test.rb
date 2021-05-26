# frozen_string_literal: true

# == Schema Information
#
# Table name: arbitrage_orders
#
#  id              :uuid             not null, primary key
#  net_profit      :decimal(, )
#  raw             :json
#  state           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  arbitrager_id   :uuid
#  market_id       :uuid
#  profit_asset_id :string
#
# Indexes
#
#  index_arbitrage_orders_on_arbitrager_id  (arbitrager_id)
#  index_arbitrage_orders_on_market_id      (market_id)
#
require 'test_helper'

class ArbitrageOrderTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
