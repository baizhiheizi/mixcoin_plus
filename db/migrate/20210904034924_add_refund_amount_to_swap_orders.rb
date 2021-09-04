class AddRefundAmountToSwapOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_orders, :refund_amount, :decimal, default: 0.0
  end
end
