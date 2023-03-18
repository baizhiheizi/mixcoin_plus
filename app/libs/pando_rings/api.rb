# frozen_string_literal: true

module PandoRings
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def markets
      path = '/api/v1/markets'
      client.get path
    end

    def supportable_asset_ids
      _cache = Rails.cache.read('pando_rings_supportable_asset_ids')
      _cache = refresh_supportable_asset_ids if _cache.blank?

      JSON.parse _cache
    rescue JSON::ParserError
      []
    end

    def refresh_supportable_asset_ids
      _markets = markets
      _ids = []
      _markets.each do |market|
        _ids.push market['asset_id']
      end
      _ids.uniq!
      Rails.cache.write 'pando_rings_supportable_asset_ids', _ids, ex: 1.hour
      _ids.to_json
    end
  end
end
