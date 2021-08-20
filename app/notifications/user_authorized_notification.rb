# frozen_string_literal: true

class UserAuthorizedNotification < ApplicationNotification
  deliver_by :mixin_bot, class: 'DeliveryMethods::MixinBot', category: 'PLAIN_TEXT', if: :recipient_messenger?

  def bot
    if params[:bot] == 'IfttbBot' && IfttbBot.api.present?
      'IfttbBot'
    else
      'MixcoinPlusBot'
    end
  end

  def message
    t('.message')
  end

  def data
    message
  end
end
