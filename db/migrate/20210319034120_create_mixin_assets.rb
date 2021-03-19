class CreateMixinAssets < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_assets do |t|
      t.uuid :asset_id, index: { unique: true }
      t.jsonb :raw

      t.timestamps
    end
  end
end
