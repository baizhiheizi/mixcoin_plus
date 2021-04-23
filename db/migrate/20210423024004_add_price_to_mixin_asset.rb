class AddPriceToMixinAsset < ActiveRecord::Migration[6.1]
  def change
    add_column :mixin_assets, :price_usd, :decimal

    MixinAsset.find_each do |asset|
      asset.update price_usd: asset.raw['price_usd']
    end
  end
end
