class AddOpponentMultisigToMixinTransfers < ActiveRecord::Migration[6.1]
  def change
    add_column :mixin_transfers, :opponent_multisig, :json, default: '{}'
  end
end
