# frozen_string_literal: true

class OceanOrderStateNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixcoin_plus_bot, class: 'DeliveryMethods::MixcoinPlusBot', category: 'PLAIN_TEXT', if: :recipient_messenger?

  around_action_cable :with_locale

  param :ocean_order

  def ocean_order
    params[:ocean_order]
  end

  def message
    format(t('.tpl'),
           base_asset_symbol: ocean_order.base_asset.symbol,
           quote_asset_symbol: ocean_order.quote_asset.symbol,
           side: ocean_order.side_text,
           state: t("order_state.#{ocean_order.state}"),
           price: ocean_order.order_type.limit? ? ocean_order.price.to_f : t('.market_price'),
           filled_symbol: ocean_order.side.ask? ? ocean_order.base_asset.symbol : ocean_order.quote_asset.symbol,
           filled: ocean_order.side.ask? ? ocean_order.filled_amount.to_f : ocean_order.filled_funds.to_f,
           remaining_symbol: ocean_order.side.ask? ? ocean_order.base_asset.symbol : ocean_order.quote_asset.symbol,
           remaining: ocean_order.side.ask? ? ocean_order.remaining_amount.to_f : ocean_order.remaining_funds.to_f)
  end

  def format_for_action_cable
    format(t('.cable_tpl'),
           base_asset_symbol: ocean_order.base_asset.symbol,
           quote_asset_symbol: ocean_order.quote_asset.symbol,
           state: t("order_state.#{ocean_order.state}"))
  end

  def data
    message
  end
end
