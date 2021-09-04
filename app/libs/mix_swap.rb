# frozen_string_literal: true

module MixSwap
  class HttpError < StandardError; end

  class ResponseError < StandardError; end

  def self.api
    @api ||= MixSwap::API.new
  end
end
