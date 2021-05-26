# frozen_string_literal: true

class MarketArbitragePatrolWorker
  include Sidekiq::Worker
  sidekiq_options queue: :low, retry: false

  def perform(id)
    Market.find(id).patrol
  end
end
