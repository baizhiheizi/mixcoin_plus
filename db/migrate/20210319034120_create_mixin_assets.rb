class CreateMixinAssets < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_assets, id: :uuid do |t|
      t.uuid :asset_id, index: { unique: true }
      t.string :name
      t.string :symbol
      t.float :price_usd
      t.float :price_btc
      t.float :change_usd
      t.float :change_btc
      t.jsonb :raw, null: false

      t.timestamps
    end
  end
end
