# frozen_string_literal: true

module Foxswap
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def pre_order(params)
      path = '/api/orders/pre'

      payload = {
        pay_asset_id: params[:pay_asset_id],
        fill_asset_id: params[:fill_asset_id],
        funds: params[:funds]&.to_s,
        amount: params[:amount]&.round(8)&.to_s
      }

      client.post path, json: payload, headers: { Authorization: Settings.foxswap.authorization }
    end

    def order(order_id, authorization:)
      path = "/api/orders/#{order_id}"
      client.get path, headers: { Authorization: authorization }
    end

    def pairs
      path = '/api/pairs'
      client.get path
    end

    def tradable_asset_ids
      _cache = Rails.cache.read('4swap_tradable_asset_ids')
      _cache = refresh_traddable_asset_ids if _cache.blank?

      _cache
    end

    def refresh_traddable_asset_ids
      _pairs = pairs['data']['pairs']
      _ids = []
      _pairs.each do |pair|
        _ids.push(pair['base_asset_id'])
        _ids.push(pair['quote_asset_id'])
      end
      _ids.uniq!
      Rails.cache.write '4swap_tradable_asset_ids', _ids, expires_in: 1.day
      _ids
    end

    def actions(**options)
      path = '/api/actions'
      payload = {
        action: [3, options[:user_id], options[:follow_id], options[:asset_id], options[:route_id], options[:minimum_fill]].join(',')
      }
      client.post path, json: payload, headers: { Authorization: Settings.foxswap.authorization }
    end
  end
end
