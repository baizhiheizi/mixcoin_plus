class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name
      t.string :avatar_url
      t.string :mixin_id
      t.uuid :mixin_uuid
      t.string :locale

      t.timestamps
    end

    add_index :users, :mixin_id, unique: true
    add_index :users, :mixin_uuid, unique: true
  end
end
