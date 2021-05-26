class CreateArbitrageOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :arbitrage_orders, id: :uuid do |t|
      t.uuid :market_id
      t.uuid :arbitrager_id
      t.string :state
      t.string :profit_asset_id
      t.decimal :net_profit
      t.json :raw

      t.timestamps
    end

    add_index :arbitrage_orders, :market_id
    add_index :arbitrage_orders, :arbitrager_id
  end
end
