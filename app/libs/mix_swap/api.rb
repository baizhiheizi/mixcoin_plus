# frozen_string_literal: true

module MixSwap
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def assets
      path = '/api/v1/assets'

      client.get path
    end

    def route(params)
      path = '/api/v1/trade/routes'

      payload = {
        payAssetUuid: params[:pay_asset_id],
        receiveAssetUuid: params[:fill_asset_id],
        payAmount: params[:pay_amount]&.to_s
      }

      client.get path, json: payload
    end

    def order(order_id)
      path = "/api/v1/order/#{order_id}"
      client.get path
    end

    def tradable_asset_ids
      _cache = Rails.cache.read('mix_swap_tradable_asset_ids')
      _cache = refresh_traddable_asset_ids if _cache.blank?

      _cache
    end

    def refresh_traddable_asset_ids
      _ids = assets['data'].map(&->(asset) { asset['uuid'] })
      _ids.uniq!
      Rails.cache.write 'mix_swap_tradable_asset_ids', _ids, expires_in: 1.day
      _ids
    end
  end
end
