class MigrateSwapOrderUsdAndAppletCount < ActiveRecord::Migration[6.1]
  def change
    AppletActivitySwapOrder.traded.find_each do |order|
      order.update pay_amount_usd: order.pay_asset.price_usd * order.pay_amount
    end

    AppletActivity.all.find_each do |activity|
      activity.update applet_id: activity.applet_action.applet_id
    end

    Applet.with_archived.find_each do |applet|
      applet.update applet_activities_count: applet.applet_activities.count
    end
  end
end
