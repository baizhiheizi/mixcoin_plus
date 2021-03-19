# frozen_string_literal: true

module MixcoinPlusBot
  def self.api
    @api ||= MixinBot::API.new(
      client_id: Rails.application.credentials.dig(:mixin, :client_id),
      client_secret: Rails.application.credentials.dig(:mixin, :client_secret),
      session_id: Rails.application.credentials.dig(:mixin, :session_id),
      pin_token: Rails.application.credentials.dig(:mixin, :pin_token),
      private_key: Rails.application.credentials.dig(:mixin, :private_key)
    )
  end
end
