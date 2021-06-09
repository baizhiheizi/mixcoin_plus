class AddBookingActivityEnableToMarkets < ActiveRecord::Migration[6.1]
  def change
    add_column :markets, :booking_order_activity_enable, :boolean, default: false
  end
end
