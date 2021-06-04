# frozen_string_literal: true

class RecommendedMarketsSyncTradesFromEngineWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: false

  def perform
    Market.recommended.map(&:sync_trades_from_engine_async)
  end
end
