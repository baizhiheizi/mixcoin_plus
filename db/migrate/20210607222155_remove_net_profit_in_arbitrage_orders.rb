class RemoveNetProfitInArbitrageOrders < ActiveRecord::Migration[6.1]
  def change
    remove_column :arbitrage_orders, :net_profit
  end
end
