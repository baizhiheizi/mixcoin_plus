class CreateUserIfttbProfiles < ActiveRecord::Migration[6.1]
  def change
    create_table :user_ifttb_profiles, id: :uuid do |t|
      t.string :user_id, null: false
      t.string :role
      t.datetime :pro_expired_at

      t.timestamps
    end

    add_index :user_ifttb_profiles, :user_id
  end
end
