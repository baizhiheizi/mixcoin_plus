# frozen_string_literal: true

# == Schema Information
#
# Table name: swap_orders
#
#  id                 :bigint           not null, primary key
#  fill_amount        :decimal(, )
#  min_amount         :decimal(, )
#  pay_amount         :decimal(, )
#  raw                :json
#  state              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  arbitrage_order_id :uuid
#  broker_id          :uuid
#  fill_asset_id      :uuid
#  pay_asset_id       :uuid
#  trace_id           :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_swap_orders_on_arbitrage_order_id  (arbitrage_order_id)
#  index_swap_orders_on_broker_id           (broker_id)
#  index_swap_orders_on_fill_asset_id       (fill_asset_id)
#  index_swap_orders_on_pay_asset_id        (pay_asset_id)
#  index_swap_orders_on_trace_id            (trace_id)
#  index_swap_orders_on_user_id             (user_id)
#
require 'test_helper'

class SwapOrderTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
