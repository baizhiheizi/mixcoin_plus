# frozen_string_literal: true

class MixinAssetGenerateOceanMarketsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: true

  def perform(id)
    MixinAsset.find_by(id: id)&.generate_ocean_markets!
  end
end
