# frozen_string_literal: true

module PandoRings
  class HttpError < StandardError; end

  class ResponseError < StandardError; end

  def self.api
    @api ||= PandoRings::API.new
  end
end
