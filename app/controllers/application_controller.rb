# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :react_base_props
  helper_method :current_user

  private

  def react_base_props
    {
      current_user: current_user&.as_json(only: %i[name]),
      mixin_bot: { app_id: '', name: '', avatar: '' }
    }.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
  end

  def current_user
  end
end
