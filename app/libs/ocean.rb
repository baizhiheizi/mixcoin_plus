# frozen_string_literal: true

module Ocean
  def self.api
    @api ||= Ocean::API.new
  end
end
