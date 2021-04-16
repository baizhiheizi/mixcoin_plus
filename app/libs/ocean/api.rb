# frozen_string_literal: true

module Ocean
  class API
    attr_reader :client

    def initialize
      @client = Client.new
    end

    def orders(access_token, market: nil, state: nil, limit: 500, offset: nil)
      path = '/orders'
      authorization = format('Bearer %<access_token>s', access_token: access_token)
      client.get(
        path,
        headers: {
          Authorization: authorization
        },
        params: {
          market: market,
          state: state,
          limit: limit,
          offset: offset
        }
      )
    end

    def order(access_token, id)
      path = format('/orders/%<id>s', id: id)
      authorization = format('Bearer %<access_token>s', access_token: access_token)
      client.get(
        path,
        headers: {
          Authorization: authorization
        }
      )
    end

    def trades(market, order: 'ASC', limit: 100, offset: '2018-08-05T23:59:59.779447612Z')
      path = format('/markets/%<market>s/trades', market: market)
      client.get(
        path,
        params: {
          order: order,
          limit: limit,
          offset: offset
        }
      )
    end
  end
end
