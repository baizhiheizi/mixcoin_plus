class CreateUserAssets < ActiveRecord::Migration[6.1]
  def change
    create_table :user_assets, id: :uuid do |t|
      t.uuid :asset_id, null: false
      t.uuid :user_id, null: false
      t.decimal :balance, default: 0.0
      t.decimal :balance_usd, default: 0.0
      t.json :raw, null: false

      t.timestamps
    end

    add_index :user_assets, :asset_id
    add_index :user_assets, :user_id
    add_column :users, :assets_synced_at, :datetime
  end
end
