class CreateMixinAssets < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_assets, id: :uuid do |t|
      t.uuid :asset_id, index: { unique: true }
      t.string :name
      t.string :symbol
      t.uuid :chain_id
      t.jsonb :raw, null: false

      t.timestamps
    end
  end
end
