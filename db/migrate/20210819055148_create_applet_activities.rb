class CreateAppletActivities < ActiveRecord::Migration[6.1]
  def change
    create_table :applet_activities, id: :uuid do |t|
      t.uuid :applet_action_id, null: false
      t.string :result

      t.timestamps
    end

    add_index :applet_activities, :applet_action_id
  end
end
