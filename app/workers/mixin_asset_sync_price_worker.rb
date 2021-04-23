# frozen_string_literal: true

class MixinAssetSyncPriceWorker
  include Sidekiq::Worker
  sidekiq_options queue: :low, retry: false

  def perform
    MixinAsset.with_price.map(&:sync)
  end
end
