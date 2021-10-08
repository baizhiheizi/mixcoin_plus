# frozen_string_literal: true

class AppletConnectedNotification < ApplicationNotification
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :recipient_messenger?

  param :applet

  def message
    "Applet ##{params[:applet].number} connected"
  end

  def data
    message
  end
end
