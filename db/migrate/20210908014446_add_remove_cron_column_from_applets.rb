class AddRemoveCronColumnFromApplets < ActiveRecord::Migration[6.1]
  def change
    remove_column :applets, :cron
    remove_column :applets, :frequency
  end
end
