class CreateBookingOrderActivities < ActiveRecord::Migration[6.1]
  def change
    create_table :booking_order_activities, id: :uuid do |t|
      t.uuid :market_id
      t.datetime :started_at
      t.datetime :ended_at
      t.float :scores_total
      t.float :bonus_total
      t.uuid :bonus_asset_id

      t.timestamps
    end

    add_index :booking_order_activities, :market_id
  end
end
