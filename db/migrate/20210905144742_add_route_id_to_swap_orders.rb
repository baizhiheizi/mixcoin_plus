class AddRouteIdToSwapOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_orders, :route_id, :string
  end
end
