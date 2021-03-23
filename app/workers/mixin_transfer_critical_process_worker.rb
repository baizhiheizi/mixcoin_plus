# frozen_string_literal: true

class MixinTransferCriticalProcessWorker
  include Sidekiq::Worker
  sidekiq_options queue: :critical, retry: true

  def perform(id)
    MixinTransfer.find_by(id: id)&.process!
  end
end
