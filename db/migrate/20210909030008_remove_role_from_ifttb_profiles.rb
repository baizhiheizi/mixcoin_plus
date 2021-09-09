class RemoveRoleFromIfttbProfiles < ActiveRecord::Migration[6.1]
  def change
    remove_column :user_ifttb_profiles, :role
  end
end
