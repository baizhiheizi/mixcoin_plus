# frozen_string_literal: true

class AppletActivitySwapOrderTradedNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :should_deliver_via_bot?

  around_action_cable :with_locale

  param :swap_order

  def swap_order
    params[:swap_order]
  end

  def data
    <<~DATA
      Applet ##{swap_order.applet.number} completed.
      
      - ↔️: #{swap_order.pay_amount} #{swap_order.pay_asset.symbol} -> #{swap_order.fill_amount} #{swap_order.fill_asset.symbol}
      - 💰: 1 #{swap_order.fill_asset.symbol} / #{(swap_order.pay_amount / swap_order.fill_amount).round(8)} #{swap_order.pay_asset.symbol}
      - 💰: 1 #{swap_order.pay_asset.symbol} / #{(swap_order.fill_amount / swap_order.pay_amount).round(8)} #{swap_order.fill_asset.symbol}
    DATA
  end

  def format_for_action_cable
    message
  end

  def message
    "Applet ##{swap_order.applet.number} completed"
  end

  def should_deliver_via_bot?
    recipient_messenger? && not_from_mixcoin_bot?
  end

  def not_from_mixcoin_bot?
    params[:swap_order].user_id != MixcoinPlusBot.api.client_id
  end
end
