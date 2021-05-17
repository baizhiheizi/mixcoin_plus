# frozen_string_literal: true

class TransferProcessedNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixcoin_plus_bot, class: 'DeliveryMethods::MixcoinPlusBot', category: 'APP_CARD', if: :recipient_messenger?

  around_action_cable :with_locale

  param :transfer

  def data
    {
      icon_url: params[:transfer].asset.icon_url,
      title: format('%.8f', params[:transfer].amount),
      description: params[:transfer].asset.symbol,
      action: "mixin://snapshots?trace=#{params[:transfer].trace_id}"
    }
  end

  def format_for_action_cable
    message
  end

  def message
    [t('.received'), params[:transfer].amount, params[:transfer].asset.symbol].join(' ')
  end

  def url
    format(
      '%<host>s/snapshots/%<snapshot_id>s',
      host: 'https://mixin.one',
      snapshot_id: params[:transfer].snapshot_id
    )
  end
end
