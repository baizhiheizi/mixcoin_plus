class AddRankToMarkets < ActiveRecord::Migration[6.1]
  def change
    add_column :markets, :rank, :integer
    
    Market.update_all('rank = 0')
  end
end
