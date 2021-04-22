class CreateGroupMarkets < ActiveRecord::Migration[6.1]
  def change
    create_table :group_markets, id: :uuid do |t|
      t.uuid :market_id, null: false
      t.uuid :mixin_conversation_id, null: false
      t.integer :rank

      t.timestamps
    end

    add_index :group_markets, :market_id
    add_index :group_markets, :mixin_conversation_id
  end
end
