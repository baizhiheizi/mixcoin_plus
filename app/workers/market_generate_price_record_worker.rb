# frozen_string_literal: true

class MarketGeneratePriceRecordWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(id, time)
    Market.find(id).generate_price_record Time.zone.parse(time)
  end
end
