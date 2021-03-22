class CreateAdministrators < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :administrators, id: :uuid do |t|
      t.string :name, null: false
      t.string :password_digest, null: false
      t.timestamps
    end

    add_index :administrators, :name, unique: true
  end
end
