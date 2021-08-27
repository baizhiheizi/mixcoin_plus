# frozen_string_literal: true

class MixinTransferCriticalProcessWorker
  include Sidekiq::Worker
  sidekiq_options queue: :critical, retry: true

  def perform(id)
    transfer = MixinTransfer.find_by(id: id)
    transfer&.process!
  rescue MixinBot::InsufficientBalanceError
    if transfer.source.is_a?(AppletActivity)
      transfer.source.fail! if transfer.source.may_fail?
      transfer.destroy!
    end
  end
end
