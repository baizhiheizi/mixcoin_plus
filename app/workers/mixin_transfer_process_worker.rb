# frozen_string_literal: true

class MixinTransferProcessWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    transfer = MixinTransfer.find_by(id: id)
    return if transfer.blank?

    transfer.process!
  rescue MixinBot::InsufficientBalanceError
    if transfer.withdraw_to_user?
      TransferFailedNotification.with(errmsg: :insufficient_balance, bot: 'IfttbBot').deliver(transfer.recipient)
      transfer.destroy!
    end
  end
end
