class CreateApplets < ActiveRecord::Migration[6.1]
  def change
    create_table :applets, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.string :title
      t.boolean :connected, default: false
      t.datetime :last_active_at

      t.timestamps
    end
  end
end
