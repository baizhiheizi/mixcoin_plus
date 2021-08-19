class CreateAppletActions < ActiveRecord::Migration[6.1]
  def change
    create_table :applet_actions, id: :uuid do |t|
      t.uuid :applet_id, null: false
      t.string :type
      t.jsonb :params

      t.timestamps
    end

    add_index :applet_actions, :applet_id
  end
end
