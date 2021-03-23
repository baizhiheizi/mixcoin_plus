# frozen_string_literal: true

class UserSyncAssetsWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    User.find(id).sync_assets
  rescue MixinBot::ForbiddenError, MixinBot::UnauthorizedError => e
    Rails.logger.error e.inspect
    raise e if Rails.env.development?
  end
end
