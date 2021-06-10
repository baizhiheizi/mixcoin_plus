class CreateBookingOrderActivityParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :booking_order_activity_participants, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :booking_order_activity_id
      t.float :scores
      t.float :bonus, default: 0.0
      t.uuid :bonus_asset_id
      t.string :state

      t.timestamps
    end

    add_index :booking_order_activity_participants, :user_id
    add_index :booking_order_activity_participants, :booking_order_activity_id, name: :participants_on_booking_order_activities_fk
  end
end
