# frozen_string_literal: true

class ArbitrageOrdersTimeoutWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: false

  def perform
    ArbitrageOrder.only_timeout.map(&:timeout!)
  end
end
