# frozen_string_literal: true

module Ifttb
  class SessionsController < Ifttb::BaseController
    skip_before_action :verify_authenticity_token, only: :create

    def new
      redirect_to format(
        'https://mixin-www.zeromesh.net/oauth/authorize?client_id=%<client_id>s&scope=%<scope>s&return_to=%<return_to>s',
        client_id: IfttbBot.api.client_id,
        scope: 'PROFILE:READ',
        return_to: params[:return_to] || ifttb_root_url
      ), allow_other_host: true
    end

    def create
      user = User.auth_from_mixin code: params[:code], access_token: params[:access_token], mixin_bot: 'IfttbBot'
      user_sign_in(user) if user

      redirect_to ifttb_root_path
    end

    def delete
      user_sign_out

      redirect_to ifttb_root_path
    end
  end
end
