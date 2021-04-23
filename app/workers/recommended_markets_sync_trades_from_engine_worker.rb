# frozen_string_literal: true

class RecommendedMarketsSyncTradesFromEngineWorker
  include Sidekiq::Worker

  def perform
    Market.recommended.map(&:sync_trades_from_engine_async)
  end
end
