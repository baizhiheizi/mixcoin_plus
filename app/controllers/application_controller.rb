# frozen_string_literal: true

class ApplicationController < ActionController::Base
  around_action :with_locale

  helper_method :react_base_props
  helper_method :current_user
  helper_method :current_conversation_id

  private

  def react_base_props
    {
      current_user: current_user && {
        name: current_user.name,
        avatar: current_user.avatar,
        invite_code: current_user.invite_code,
        may_invited: current_user.may_invited?,
        invitor: current_user.invitor && {
          mixin_id: current_user.invitor.mixin_id,
          mixin_uuid: current_user.invitor.mixin_uuid,
          name: current_user.invitor.name
        }
      },
      mixin_bot: {
        app_id: MixcoinPlusBot.api.client_id,
        app_name: 'Mixcoin Plus',
        app_icon_url: ''
      }
    }.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
  end

  def current_user
    @current_user = User.find_by(id: session[:current_user_id])
  end

  def user_sign_in(user)
    session[:current_user_id] = user.id
  end

  def user_sign_out
    session[:current_user_id] = nil
    @current_user = nil
  end

  def current_conversation_id
    request.env['HTTP_X_CONVERSATION_ID']
  end

  def with_locale(&action)
    locale = current_user&.locale || I18n.default_locale
    I18n.with_locale(locale, &action)
  end
end
