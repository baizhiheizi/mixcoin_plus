# frozen_string_literal: true

class AppletAlertActionNotification < ApplicationNotification
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :recipient_messenger?

  param :applet_alert_action

  def message
    params[:applet_alert_action].data
  end

  def data
    message
  end
end
