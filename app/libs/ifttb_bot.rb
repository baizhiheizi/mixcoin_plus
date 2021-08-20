# frozen_string_literal: true

module IfttbBot
  ICON_URL = 'https://mixin-images.zeromesh.net/QesS8-z69oJBMiY2MTmCIBBZJFlgwfZaqHdNv2ejxNo534QLKIdP8fr_anco927kERbLAsY9NbJOyvtf-EU7RTDL1QDOcmcInpK1=s256'

  def self.api
    @api ||= MixinBot::API.new(
      client_id: Rails.application.credentials.dig(:ifttb_bot, :client_id),
      client_secret: Rails.application.credentials.dig(:ifttb_bot, :client_secret),
      session_id: Rails.application.credentials.dig(:ifttb_bot, :session_id),
      pin_token: Rails.application.credentials.dig(:ifttb_bot, :pin_token),
      private_key: Rails.application.credentials.dig(:ifttb_bot, :private_key)
    )
  end
end
