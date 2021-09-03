class AddPayAmountUsdToSwapOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_orders, :pay_amount_usd, :decimal
  end
end
