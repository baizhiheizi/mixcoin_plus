# frozen_string_literal: true

class SendMixinMessageWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(message, bot = 'MixcoinPlusBot')
    mixin_api = 
      case bot
      when 'IfttbBot'
        IfttbBot.api
      else
        MixcoinPlusBot.api
      end

    mixin_api.send_message message
  rescue MixinBot::ForbiddenError, MixinBot::UnauthorizedError => e
    Rails.logger.error e.inspect
    raise e if Rails.env.development?
  end
end
