# frozen_string_literal: true

class Admin::BaseController < ActionController::Base
  layout 'admin'

  helper_method :react_base_props

  private

  def react_base_props
    {
      current_admin: current_admin&.as_json(only: %i[name]),
      mixin_bot: {
        app_id: MixcoinPlusBot.api.client_id,
        app_name: 'Mixcoin',
        app_icon_url: MixcoinPlusBot::ICON_URL
      }
    }.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
  end

  def authenticate_admin!
    redirect_to root_path unless current_admin
  end

  def current_admin
    @current_admin ||= session[:current_admin_id] && Administrator.find_by(id: session[:current_admin_id])
  end

  def admin_sign_in(admin)
    session[:current_admin_id] = admin.id
  end

  def admin_sign_out
    session[:current_admin_id] = nil
    @current_admin = nil
  end
end
