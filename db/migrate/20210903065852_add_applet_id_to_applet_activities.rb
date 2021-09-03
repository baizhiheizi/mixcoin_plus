class AddAppletIdToAppletActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :applet_activities, :applet_id, :uuid
    add_index :applet_activities, :applet_id

    add_column :applets, :applet_activities_count, :integer, default: 0
  end
end
