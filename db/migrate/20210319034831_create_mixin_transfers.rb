class CreateMixinTransfers < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_transfers, id: :uuid do |t|
      t.uuid :source_id
      t.string :source_type
      t.string :transfer_type
      t.decimal :amount
      t.uuid :trace_id
      t.uuid :asset_id
      t.uuid :user_id
      t.uuid :opponent_id
      t.string :memo
      t.datetime :processed_at
      t.json :snapshot
      t.string :priority

      t.timestamps
    end

    add_index :mixin_transfers, [:source_id, :source_type]
    add_index :mixin_transfers, :user_id
    add_index :mixin_transfers, :trace_id, unique: true
  end
end
