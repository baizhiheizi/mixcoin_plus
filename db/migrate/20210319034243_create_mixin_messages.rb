class CreateMixinMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_messages, id: :uuid do |t|
      t.string :content, comment: 'decrypted data'
      t.uuid :message_id
      t.string :category
      t.uuid :user_id
      t.uuid :conversation_id
      t.json :raw
      t.datetime :processed_at

      t.timestamps
    end

    add_index :mixin_messages, :message_id, unique: true
  end
end
