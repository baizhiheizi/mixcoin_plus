# frozen_string_literal: true

class MarketSyncTradesFromEngineWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    market = Market.find(id)
    return if market.sync_trades_frequency_locked?

    market.sync_trades_frequency_lock!
    market.sync_trades_from_engine
    market.sync_trades_frequency_unlock!
  rescue StandardError => e
    market.sync_trades_frequency_unlock!
    raise e if Rails.env.development?
  end
end
