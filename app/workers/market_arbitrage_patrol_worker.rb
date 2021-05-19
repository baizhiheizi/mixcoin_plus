# frozen_string_literal: true

class MarketArbitragePatrolWorker
  include Sidekiq::Worker

  def perform(id)
    Market.find(id).patrol
  end
end
