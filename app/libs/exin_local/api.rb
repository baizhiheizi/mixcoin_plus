# frozen_string_literal: true

module ExinLocal
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def settings
      path = '/api/v1/settings'

      client.get path
    end

    def cached_settings
      _cache = Global.redis.get('exin_local_settings')
      _cache = refresh_cached_settings if _cache.blank?
      JSON.parse _cache
    rescue JSON::ParserError
      []
    end

    def refresh_cached_settings
      _settings = settings
      Global.redis.set 'exin_local_settings', _settings.to_json, ex: 1.minute

      _settings.to_json
    end

    def advertisements(asset_id:, legal_currency_symbol: 'CNY', type: 'sell')
      assets = cached_settings['assets']
      legal_currencies = cached_settings['legal_currencies']
      asset = assets.find(&->(_asset) { _asset['mixinId'] = asset_id })
      legal_currency = legal_currencies.find(&->(currency) { currency['symbol'] = legal_currency_symbol })

      path = 'api/v1/home-advertisements'
      client.get path, params: { asset_id: asset['id'], legal_currency_id: legal_currency['id'], type: type }
    end

    def tradable_asset_ids
      cached_settings['assets'].first(6).map(&->(asset) { asset['mixinId'] })
    end
  end
end
