# frozen_string_literal: true

class OceanOrderStateNotification < ApplicationNotification
  deliver_by :mixcoin_plus_bot, class: 'DeliveryMethods::MixcoinPlusBot', category: 'PLAIN_TEXT'

  param :ocean_order

  def ocean_order
    params[:ocean_order]
  end

  def message
    format(t('.tpl'),
           base_asset_symbol: ocean_order.base_asset.symbol,
           quote_asset_symbol: ocean_order.quote_asset.symbol,
           trace_id: ocean_order.trace_id,
           side: ocean_order.side_text,
           state: t("order_state.#{ocean_order.state}"),
           price: ocean_order.order_type.limit? ? ocean_order.price.to_f : t('.market_price'),
           filled_symbol: ocean_order.side.ask? ? ocean_order.base_asset.symbol : ocean_order.quote_asset.symbol,
           filled: ocean_order.side.ask? ? ocean_order.filled_amount : ocean_order.filled_funds,
           remaining_symbol: ocean_order.side.ask? ? ocean_order.base_asset.symbol : ocean_order.quote_asset.symbol,
           remaining: ocean_order.side.ask? ? ocean_order.remaining_amount : ocean_order.remaining_funds)
  end

  def data
    message
  end
end
