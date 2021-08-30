# frozen_string_literal: true

class TransferProcessedNotification < ApplicationNotification
  deliver_by :action_cable, format: :format_for_action_cable
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'APP_CARD', if: :should_deliver_via_bot?

  around_action_cable :with_locale

  param :transfer

  def data
    {
      icon_url: params[:transfer].asset.icon_url,
      title: format('%.8f', params[:transfer].amount),
      description: params[:transfer].asset.symbol,
      action: "mixin://snapshots?trace=#{params[:transfer].trace_id}",
      shareable: false
    }
  end

  def bot
    if params[:transfer].source.is_a?(AppletActivitySwapOrder)
      'IfttbBot'
    else
      'MixcoinPlusBot'
    end
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

  def should_deliver_via_bot?
    recipient_messenger? && not_from_mixcoin_bot?
  end

  def not_from_mixcoin_bot?
    params[:transfer].user_id != MixcoinPlusBot.api.client_id
  end
end
