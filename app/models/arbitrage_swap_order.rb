# frozen_string_literal: true

# == Schema Information
#
# Table name: swap_orders
#
#  id                 :uuid             not null, primary key
#  fill_amount        :decimal(, )
#  min_amount         :decimal(, )
#  pay_amount         :decimal(, )
#  pay_amount_usd     :decimal(, )
#  raw                :json
#  refund_amount      :decimal(, )      default(0.0)
#  state              :string
#  type               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  applet_activity_id :uuid
#  arbitrage_order_id :uuid
#  broker_id          :uuid
#  fill_asset_id      :uuid
#  pay_asset_id       :uuid
#  trace_id           :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_swap_orders_on_applet_activity_id  (applet_activity_id)
#  index_swap_orders_on_arbitrage_order_id  (arbitrage_order_id)
#  index_swap_orders_on_broker_id           (broker_id)
#  index_swap_orders_on_fill_asset_id       (fill_asset_id)
#  index_swap_orders_on_pay_asset_id        (pay_asset_id)
#  index_swap_orders_on_trace_id            (trace_id)
#  index_swap_orders_on_user_id             (user_id)
#
class ArbitrageSwapOrder < SwapOrder
  include SwapOrders::FoxSwappable

  belongs_to :arbitrage_order

  after_commit on: :create do
    pay!
  end

  def arbitrage?
    arbitrage_order.present?
  end

  def check_arbitrage_order
    return unless arbitrage?

    if arbitrage_order.may_complete?
      arbitrage_order.complete!
    else
      arbitrage_order.calculate_net_profit
    end
  end

  def after_trade
    sync_order
    check_arbitrage_order
  end
end
