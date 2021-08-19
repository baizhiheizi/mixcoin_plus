class CreateAppletTriggers < ActiveRecord::Migration[6.1]
  def change
    create_table :applet_triggers, id: :uuid do |t|
      t.uuid :applet_id, null: false
      t.string :type
      t.jsonb :params

      t.timestamps
    end

    add_index :applet_triggers, :applet_id
  end
end
