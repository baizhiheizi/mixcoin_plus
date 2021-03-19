class CreateMixinMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :mixin_messages do |t|
      t.string :content, comment: 'decrepted data'
      t.json :raw
      t.datetime :processed_at

      t.timestamps
    end
  end
end
