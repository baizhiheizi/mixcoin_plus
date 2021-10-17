class AddSnapshotToAppletActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :applet_activities, :snapshot, :json
  end
end
