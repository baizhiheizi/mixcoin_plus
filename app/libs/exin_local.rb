# frozen_string_literal: true

module ExinLocal
  class HttpError < StandardError; end

  class ResponseError < StandardError; end

  def self.api
    @api ||= ExinLocal::API.new
  end
end
