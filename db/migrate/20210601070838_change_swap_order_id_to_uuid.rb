class ChangeSwapOrderIdToUuid < ActiveRecord::Migration[6.1]
  def up
    add_column :swap_orders, :uuid, :uuid, null: false, default: -> { "gen_random_uuid()" }

    remove_column :swap_orders, :id
    rename_column :swap_orders, :uuid, :id
    execute "ALTER TABLE swap_orders    ADD PRIMARY KEY (id);"
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
