class CreateMixinNetworkUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_network_users, id: :uuid do |t|
      t.belongs_to :owner, polymorphic: true
      t.uuid :mixin_uuid
      t.string :name
      t.uuid :session_id
      t.string :pin_token
      t.json :raw
      t.string :private_key
      t.string :encrypted_pin

      t.timestamps
    end

    add_index :mixin_network_users, :mixin_uuid, unique: true
  end
end
