# frozen_string_literal: true

class MixinConversationRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    MixinConversation.find_by(id: id)&.refresh!
  end
end
