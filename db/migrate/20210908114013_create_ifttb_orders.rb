class CreateIfttbOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :ifttb_orders, id: :uuid do |t|
      t.uuid :user_id
      t.string :state
      t.string :order_type
      t.uuid :asset_id
      t.decimal :amount
      t.decimal :amount_usd

      t.timestamps
    end

    add_index :ifttb_orders, :user_id
  end
end
