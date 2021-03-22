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
  end
end
