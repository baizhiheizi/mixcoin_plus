# frozen_string_literal: true

class SendMixinMessageWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(message)
    MixcoinPlusBot.api.send_message message
  rescue MixinBot::ForbiddenError, MixinBot::UnauthorizedError => e
    Rails.logger.error e.inspect
    raise e if Rails.env.development?
  end
end
