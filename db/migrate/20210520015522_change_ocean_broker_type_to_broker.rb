class ChangeOceanBrokerTypeToBroker < ActiveRecord::Migration[6.1]
  def change
    MixinNetworkUser.where(type: 'OceanBroker').each do |user|
      user.update type: 'Broker'
    end
  end
end
