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

    def pre_order(params)
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
  end
end
