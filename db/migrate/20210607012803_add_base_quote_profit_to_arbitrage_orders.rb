class AddBaseQuoteProfitToArbitrageOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :arbitrage_orders, :base_asset_profit, :float, default: 0.0
    add_column :arbitrage_orders, :quote_asset_profit, :float, default: 0.0

    remove_column :arbitrage_orders, :profit_asset_id
  end
end
