# frozen_string_literal: true

class OceanBrokerInitializeWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    MixinNetworkUser.where(type: %w[Broker Arbitrager]).find_by(id: id)&.initialize_broker_account
  end
end
