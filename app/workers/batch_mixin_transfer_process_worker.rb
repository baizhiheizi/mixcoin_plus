# frozen_string_literal: true

class BatchMixinTransferProcessWorker
  include Sidekiq::Worker
  sidekiq_options queue: :high, retry: false

  def perform
    MixinTransfer.unprocessed.where(created_at: ...(Time.current - 2.minutes)).map(&:process_async)
  end
end
