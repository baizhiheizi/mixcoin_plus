# frozen_string_literal: true

module PandoLeaf
  class HttpError < StandardError; end

  class ResponseError < StandardError; end

  def self.api
    @api ||= PandoLeaf::API.new
  end
end
