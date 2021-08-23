# frozen_string_literal: true

class IfttbBrokerInitializeWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    IfttbBroker.find_by(id: id)&.initialize_broker_account
  end
end
