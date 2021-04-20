class AddRecommendedAtToMarkets < ActiveRecord::Migration[6.1]
  def change
    add_column :markets, :recommended_at, :datetime
  end
end
