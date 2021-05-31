class AddHiddenAtToMarkets < ActiveRecord::Migration[6.1]
  def change
    add_column :markets, :hidden_at, :datetime
  end
end
