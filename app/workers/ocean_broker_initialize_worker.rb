# frozen_string_literal: true

class OceanBrokerInitializeWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    OceanBroker.find_by(id: id)&.initialize_broker_account
  rescue MixinBot::ForbiddenError, MixinBot::UnauthorizedError => e
    Rails.logger.error e.inspect
    raise e if Rails.env.development?
  end
end
