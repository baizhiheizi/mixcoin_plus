class AddStaleToMixinTransfers < ActiveRecord::Migration[7.0]
  def change
    add_column :mixin_transfers, :stale, :boolean, default: false
  end
end
