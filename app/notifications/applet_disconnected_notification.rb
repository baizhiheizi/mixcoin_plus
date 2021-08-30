# frozen_string_literal: true

class AppletDisconnectedNotification < ApplicationNotification
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :recipient_messenger?

  param :applet

  def message
    "Applet ##{params[:applet].number} disconnected"
  end

  def data
    message
  end
end
