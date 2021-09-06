# frozen_string_literal: true

class MixinTransferCriticalProcessWorker
  include Sidekiq::Worker
  sidekiq_options queue: :critical, retry: true

  def perform(id)
    transfer = MixinTransfer.find_by(id: id)
    transfer&.process!
  rescue MixinBot::InsufficientBalanceError, MixinBot::InsufficientPoolError
    if transfer.source.type.in? %w[AppletActivitySwapOrder AppletActivityMixSwapOrder]
      swap_order = transfer.source
      swap_order.applet_activity.fail! if swap_order.applet_activity.may_fail?
      swap_order.applet_activity.applet.may_connect?

      transfer.destroy!
      swap_order.destroy!
    end
  end
end
