class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications, id: :uuid do |t|
      t.uuid :recipient_id, null: false
      t.string :recipient_type, null: false
      t.string :type, null: false
      t.jsonb :params
      t.datetime :read_at

      t.timestamps
    end

    add_index :notifications, [:recipient_id, :recipient_type]
    add_index :notifications, :read_at
  end
end
