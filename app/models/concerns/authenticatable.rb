# frozen_string_literal: true

module Authenticatable
  extend ActiveSupport::Concern

  class_methods do
    def auth_from_mixin(code: nil, access_token: nil, mixin_bot: 'MixcoinPlusBot')
      mixin_api =
        case mixin_bot
        when 'MixcoinPlusBot'
          MixcoinPlusBot.api
        when 'IfttbBot'
          IfttbBot.api
        end
      provider =
        case mixin_bot
        when 'MixcoinPlusBot'
          :mixin
        when 'IfttbBot'
          :ifttb
        end

      access_token ||= mixin_api.oauth_token(code)
      res = mixin_api.read_me access_token: access_token
      raise res.inspect if res['error'].present?

      auth = UserAuthorization.find_by(
        uid: res['data'].fetch('user_id'),
        provider: provider
      )
      if auth.present?
        auth.update! access_token: access_token, raw: res['data']
      else
        auth = UserAuthorization.create!(
          access_token: access_token,
          raw: res['data'],
          uid: res['data'].fetch('user_id'),
          provider: provider
        )
      end

      if auth.user.present?
        user = auth.user
      else
        user = create_with(mixin_authorization: auth).find_or_create_by(mixin_uuid: res['data'].fetch('user_id'))
        auth.update user: user
      end

      UserAuthorizedNotification.with({ bot: mixin_bot }).deliver(user) if user.present?
      user
    end
  end
end
