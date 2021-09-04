# frozen_string_literal: true

class AppletActivityStateNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', bot: 'IfttbBot', if: :should_deliver_via_bot?

  around_action_cable :with_locale

  param :applet_activity

  def applet_activity
    params[:applet_activity]
  end

  delegate :swap_orders, to: :applet_activity

  def swap_order_detail
    swap_orders.map do |swap_order|
      _provider =
        case swap_order
        when AppletActivitySwapOrder
          '4swap'
        when AppletActivityMixSwapOrder
          'MixSwap'
        end

      _pay_amount = swap_order.pay_amount - swap_order.refund_amount
      <<~DATA
        - #{_provider}
        - ↔️: #{_pay_amount} #{swap_order.pay_asset.symbol} -> #{swap_order.fill_amount} #{swap_order.fill_asset.symbol}
        - 💰: 1 #{swap_order.fill_asset.symbol} / #{(_pay_amount / swap_order.fill_amount).round(8)} #{swap_order.pay_asset.symbol}
        - 💰: 1 #{swap_order.pay_asset.symbol} / #{(swap_order.fill_amount / _pay_amount).round(8)} #{swap_order.fill_asset.symbol}
      DATA
    end.join("\n\n")
  end

  def data
    case applet_activity.state.to_sym
    when :failed
      message
    when :completed
      [message, swap_order_detail].join("\n\n")
    end
  end

  def format_for_action_cable
    message
  end

  def message
    "Applet ##{applet_activity&.applet&.number} activity #{applet_activity.state}"
  end

  def should_deliver_via_bot?
    recipient_messenger? && not_from_mixcoin_bot?
  end

  def not_from_mixcoin_bot?
    applet_activity&.applet&.user_id != MixcoinPlusBot.api.client_id
  end
end
