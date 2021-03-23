# frozen_string_literal: true

class MixinTransferProcessWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    MixinTransfer.find_by(id: id)&.process!
  end
end
