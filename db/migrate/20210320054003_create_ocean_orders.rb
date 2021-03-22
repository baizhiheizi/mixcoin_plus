class CreateOceanOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :ocean_orders do |t|
      t.decimal :filled_amount
      t.decimal :filled_funds
      t.string :order_type
      t.decimal :price
      t.decimal :remaining_amount
      t.decimal :remaining_funds
      t.string :side
      t.string :state
      t.uuid :base_asset_id
      t.uuid :quote_asset_id
      t.uuid :user_id
      t.uuid :broker_id
      t.uuid :conversation_id
      t.uuid :trace_id
      t.float :maker_fee, default: 0.0
      t.float :taker_fee, default: 0.0

      t.timestamps
    end
  end
end
