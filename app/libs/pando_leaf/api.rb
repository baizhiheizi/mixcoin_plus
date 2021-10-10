# frozen_string_literal: true

module PandoLeaf
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def assets
      path = '/api/assets'
      client.get path
    end

    def cats
      path = '/api/cats'
      client.get path
    end

    def cat(id)
      path = "/api/cats/#{id}"
      client.get path
    end

    def flips(cursor: nil, limit: 100)
      path = '/api/flips'
      client.get path, params: { cursor: cursor, limit: limit }
    end

    def vats
      path = '/api/vats'
      client.get path
    end

    def oracles
      path = '/api/oracles'
      client.get path
    end

    def oracle(asset_id)
      path = "/api/oracles/#{asset_id}"
      client.get path
    end

    def supportable_asset_ids
      _cache = Global.redis.get('pando_leaf_supportable_asset_ids')
      _cache = refresh_supportable_asset_ids if _cache.blank?

      JSON.parse _cache
    rescue JSON::ParserError
      []
    end

    def refresh_supportable_asset_ids
      _cats = cats['data']['collaterals']
      _ids = []
      _cats.each do |cat|
        _ids.push(cat['gem'])
      end
      _ids.uniq!
      Global.redis.set 'pando_leaf_supportable_asset_ids', _ids, ex: 1.hour
      _ids.to_json
    end
  end
end
