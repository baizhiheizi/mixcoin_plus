class CreateMarketPrices < ActiveRecord::Migration[6.1]
  def change
    create_table :market_prices, id: :uuid do |t|
      t.uuid :market_id
      t.float :price
      t.datetime :time

      t.timestamps
    end

    add_index :market_prices, :market_id
    add_index :market_prices, :time
  end
end
