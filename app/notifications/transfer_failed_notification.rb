# frozen_string_literal: true

class TransferFailedNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', if: :should_deliver_via_bot?

  around_action_cable :with_locale

  param :errmsg, :bot

  def data
    message
  end

  def bot
    params[:bot]
  end

  def format_for_action_cable
    message
  end

  def message
    case params[:errmsg].to_sym
    when :insufficient_balance
      t('.insufficient_balance')
    else
      t('.transfer_failed')
    end
  end

  def should_deliver_via_bot?
    recipient_messenger?
  end
end
