# frozen_string_literal: true

class Ifttb::BaseController < ApplicationController
  layout 'ifttb'

  private

  def react_base_props
    {
      current_user: current_user && {
        name: current_user.name,
        avatar: current_user.avatar,
        mixin_uuid: current_user.mixin_uuid,
        invite_code: current_user.invite_code,
        may_invited: current_user.may_invited?,
        fennec: current_user.fennec?
      },
      mixin_bot: {
        app_id: IfttbBot.api.client_id,
        app_name: 'IFTTB',
        app_icon_url: MixcoinPlusBot::ICON_URL
      }
    }.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
  end
end
