# frozen_string_literal: true

# == Schema Information
#
# Table name: arbitrage_orders
#
#  id                 :uuid             not null, primary key
#  base_asset_profit  :float            default(0.0)
#  net_profit         :decimal(, )
#  quote_asset_profit :float            default(0.0)
#  raw                :json
#  state              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  arbitrager_id      :uuid
#  market_id          :uuid
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
