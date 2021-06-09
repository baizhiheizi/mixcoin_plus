class CreateBookingOrderSnapshots < ActiveRecord::Migration[6.1]
  def change
    create_table :booking_order_snapshots, id: :uuid do |t|
      t.uuid :market_id
      t.uuid :user_id
      t.uuid :ocean_order_id
      t.float :ticker
      t.float :funds
      t.float :price
      t.float :scores
      t.float :order_weight
      t.json :snapshot
      t.integer :timestamp

      t.timestamps
    end

    add_index :booking_order_snapshots, :market_id
    add_index :booking_order_snapshots, :user_id
    add_index :booking_order_snapshots, :ocean_order_id
  end
end
