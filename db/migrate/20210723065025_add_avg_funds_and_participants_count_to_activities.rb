class AddAvgFundsAndParticipantsCountToActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :booking_order_activities, :traded_amount, :float
    add_column :booking_order_activities, :traded_funds, :float
    add_column :booking_order_activities, :avg_funds, :float
    add_column :booking_order_activities, :participants_count, :integer
  end
end
