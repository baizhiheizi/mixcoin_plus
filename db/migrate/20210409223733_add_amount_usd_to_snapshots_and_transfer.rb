class AddAmountUsdToSnapshotsAndTransfer < ActiveRecord::Migration[6.1]
  def change
    add_column :mixin_network_snapshots, :amount_usd, :decimal, default: 0.0
    add_column :mixin_transfers, :amount_usd, :decimal, default: 0.0
  end
end
