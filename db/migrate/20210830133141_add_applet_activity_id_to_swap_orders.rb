class AddAppletActivityIdToSwapOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_orders, :applet_activity_id, :uuid
    add_index :swap_orders, :applet_activity_id

    add_column :swap_orders, :type, :string
  end
end
