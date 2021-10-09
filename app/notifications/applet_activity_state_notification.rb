# frozen_string_literal: true

class AppletActivityStateNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :should_deliver_via_bot?

  around_action_cable :with_locale

  param :applet_activity

  def applet_activity
    params[:applet_activity]
  end

  def data
    applet_activity.notification_text
  end

  def format_for_action_cable
    message
  end

  def message
    applet_activity.notification_state_text
  end

  def should_deliver_via_bot?
    recipient_messenger?
  end
end
