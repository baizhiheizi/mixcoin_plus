# frozen_string_literal: true

class RecommendedMarketsArbitragerPatrolWorker
  include Sidekiq::Worker

  def perform
    Market.recommended.map(&:patrol_async)
  end
end
