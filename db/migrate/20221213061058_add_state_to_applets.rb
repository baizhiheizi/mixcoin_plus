class AddStateToApplets < ActiveRecord::Migration[7.0]
  def change
    add_column :applets, :state, :string
    add_column :applets, :type, :string

    Applet.all.each do |applet|
      applet.update state: :pending
    end
  end
end
