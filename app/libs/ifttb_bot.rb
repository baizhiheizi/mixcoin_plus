# frozen_string_literal: true

module IfttbBot
  ICON_URL = 'https://mixin-images.zeromesh.net/QesS8-z69oJBMiY2MTmCIBBZJFlgwfZaqHdNv2ejxNo534QLKIdP8fr_anco927kERbLAsY9NbJOyvtf-EU7RTDL1QDOcmcInpK1=s256'

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
