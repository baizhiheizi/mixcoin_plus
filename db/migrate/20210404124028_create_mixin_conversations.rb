class CreateMixinConversations < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_conversations, id: :uuid do |t|
      t.string :category
      t.json :data
      t.string :name
      t.uuid :conversation_id, null: false
      t.uuid :code_id
      t.uuid :creator_id
      t.uuid :participant_uuids, array: true, default: []

      t.timestamps
    end

    add_index :mixin_conversations, :creator_id
    add_index :mixin_conversations, :conversation_id, unique: true
  end
end
