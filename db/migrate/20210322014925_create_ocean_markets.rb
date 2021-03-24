class CreateOceanMarkets < ActiveRecord::Migration[6.1]
  def change
    create_table :ocean_markets, id: :uuid do |t|
      t.uuid :base_asset_id
      t.uuid :quote_asset_id
      t.string :base_asset_symbol
      t.string :quote_asset_symbol
      t.decimal :turnover, default: 0.0
      t.decimal :maker_turnover, default: 0.0
      t.decimal :taker_turnover, default: 0.0
      t.integer :ocean_orders_count, default: 0

      t.timestamps
    end

    add_index :ocean_markets, :base_asset_id
    add_index :ocean_markets, :quote_asset_id

    add_column :ocean_orders, :ocean_market_id, :uuid, null: false
    add_index :ocean_orders, :ocean_market_id
  end
end
