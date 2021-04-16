class CreateTrades < ActiveRecord::Migration[6.1]
  def change
    create_table :trades, id: :uuid do |t|
      t.uuid :market_id, null: false
      t.uuid :trade_id, null: false
      t.uuid :base_asset_id, null: false
      t.uuid :quote_asset_id, null: false
      t.decimal :amount
      t.decimal :price
      t.string :side
      t.json :raw, null: false
      t.datetime :traded_at

      t.timestamps
    end

    add_index :trades, :market_id
    add_index :trades, :trade_id, unique: true
    add_index :trades, :base_asset_id
    add_index :trades, :quote_asset_id

    add_column :markets, :trades_count, :integer, default: 0
  end
end
