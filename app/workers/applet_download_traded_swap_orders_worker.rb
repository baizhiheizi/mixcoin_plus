# frozen_string_literal: true

class AppletDownloadTradedSwapOrdersWorker
  include Sidekiq::Worker
  sidekiq_options queue: :low, retry: 3

  def perform(id)
    Applet.find_by(id: id)&.download_traded_swap_orders
  end
end
