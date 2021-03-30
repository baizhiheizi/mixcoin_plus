# frozen_string_literal: true

class MixinAssetGenerateMarketsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: true

  def perform(id)
    MixinAsset.find_by(id: id)&.generate_markets!
  end
end
