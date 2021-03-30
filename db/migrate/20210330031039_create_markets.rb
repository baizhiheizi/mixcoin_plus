class CreateMarkets < ActiveRecord::Migration[6.1]
  def change
    create_table :markets, id: :uuid do |t|
      t.uuid :base_asset_id
      t.uuid :quote_asset_id
      t.integer :ocean_orders_count, default: 0

      t.timestamps
    end

    add_index :markets, :base_asset_id
    add_index :markets, :quote_asset_id

    add_column :ocean_orders, :market_id, :uuid, null: false
    add_index :ocean_orders, :market_id
  end
end
