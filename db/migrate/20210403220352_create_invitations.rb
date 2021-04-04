class CreateInvitations < ActiveRecord::Migration[6.1]
  def change
    create_table :invitations, id: :uuid do |t|
      t.uuid :invitor_id
      t.uuid :invitee_id

      t.timestamps
    end

    add_index :invitations, :invitee_id, unique: true
    add_index :invitations, :invitor_id

    add_column :users, :invitations_count, :integer, default: 0
    add_column :users, :invite_code, :string
    add_index :users, :invite_code, unique: true
  end
end
