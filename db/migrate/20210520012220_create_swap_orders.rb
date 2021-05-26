class CreateSwapOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :swap_orders do |t|
      t.uuid :arbitrage_order_id
      t.uuid :user_id
      t.uuid :pay_asset_id
      t.uuid :fill_asset_id
      t.decimal :pay_amount
      t.decimal :fill_amount
      t.decimal :min_amount
      t.uuid :broker_id
      t.string :state
      t.uuid :trace_id
      t.json :raw

      t.timestamps
    end

    add_index :swap_orders, :arbitrage_order_id
    add_index :swap_orders, :user_id
    add_index :swap_orders, :trace_id
    add_index :swap_orders, :broker_id
    add_index :swap_orders, :pay_asset_id
    add_index :swap_orders, :fill_asset_id

    add_column :ocean_orders, :arbitrage_order_id, :uuid
    add_index :ocean_orders, :arbitrage_order_id
  end
end
