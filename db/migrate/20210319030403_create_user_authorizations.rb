class CreateUserAuthorizations < ActiveRecord::Migration[6.1]
  def change
    create_table :user_authorizations, id: :uuid do |t|
      t.uuid :user_id
      t.string :provider, comment: 'third party auth provider'
      t.string :uid, comment: 'third party user id'
      t.string :access_token
      t.json :raw, comment: 'third pary user info'

      t.timestamps
    end

    add_index :user_authorizations, :user_id
    add_index :user_authorizations, [:provider, :uid], unique: true
  end
end
