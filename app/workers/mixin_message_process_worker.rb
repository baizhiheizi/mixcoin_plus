# frozen_string_literal: true

class MixinMessageProcessWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    MixinMessage.find_by(id: id)&.process!
  end
end
