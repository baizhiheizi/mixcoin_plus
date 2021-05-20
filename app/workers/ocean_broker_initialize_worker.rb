# frozen_string_literal: true

class OceanBrokerInitializeWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    Broker.find_by(id: id)&.initialize_broker_account
  end
end
