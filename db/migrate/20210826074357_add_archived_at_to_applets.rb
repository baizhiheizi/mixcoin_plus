class AddArchivedAtToApplets < ActiveRecord::Migration[6.1]
  def change
    add_column :applets, :archived_at, :datetime
  end
end
