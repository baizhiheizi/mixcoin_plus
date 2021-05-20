# frozen_string_literal: true

module Ocean
  class HttpError < StandardError; end

  class ResponseError < StandardError; end

  def self.api
    @api ||= Ocean::API.new
  end
end
