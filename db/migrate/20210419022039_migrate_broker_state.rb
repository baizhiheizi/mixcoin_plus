class MigrateBrokerState < ActiveRecord::Migration[6.1]
  def change
    OceanBroker.find_each do |broker|
      broker.ready! if broker.balanced? && broker.ensure_can_fetch_orders
    end
  end
end
