class MigrateIfttbRelatedData < ActiveRecord::Migration[6.1]
  def change
    SwapOrder.where(type: nil).each do |order|
      order.update type: 'ArbitrageSwapOrder'
    end

    User.find_each do |user|
      IfttbBot.api.create_contact_conversation user.mixin_uuid
      user.create_ifttb_profile if user.ifttb_profile.blank?
      user.create_brokers_async
    end
  end
end
