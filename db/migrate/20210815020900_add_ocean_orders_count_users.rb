class AddOceanOrdersCountUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :ocean_orders_count, :integer, default: 0
  end
end
