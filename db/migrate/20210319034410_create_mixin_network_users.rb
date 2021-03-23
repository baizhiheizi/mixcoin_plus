class CreateMixinNetworkUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_network_users, id: :uuid do |t|
      t.uuid :owner_id
      t.string :owner_type
      t.string :type, comment: 'STI'
      t.uuid :mixin_uuid
      t.string :name
      t.uuid :session_id
      t.string :pin_token
      t.json :raw
      t.string :private_key
      t.string :encrypted_pin
      t.string :state
      t.string :ocean_private_key

      t.timestamps
    end

    add_index :mixin_network_users, [:owner_id, :owner_type]
    add_index :mixin_network_users, :mixin_uuid, unique: true
  end
end
