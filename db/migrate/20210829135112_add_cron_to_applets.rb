class AddCronToApplets < ActiveRecord::Migration[6.1]
  def change
    add_column :applets, :cron, :string
  end
end
