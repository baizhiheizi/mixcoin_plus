# frozen_string_literal: true

class BatchMarketGeneratePriceRecordsWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform
    Market.where('trades_count > ?', 0).map(&:generate_price_record_async)
  end
end
