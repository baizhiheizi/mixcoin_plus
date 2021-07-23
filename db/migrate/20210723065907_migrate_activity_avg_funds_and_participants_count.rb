class MigrateActivityAvgFundsAndParticipantsCount < ActiveRecord::Migration[6.1]
  def change
    BookingOrderActivity.all.each do |activity|
      BookingOrderActivity.reset_counters activity.id, :participants
      activity.update(
        avg_funds: activity.booking_order_snapshots.sum(:funds) / (24 * 60),
        traded_amount: activity.trades.sum(:amount),
        traded_funds: activity.trades.sum('amount * price')
      ) 
    end
  end
end
