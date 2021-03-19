# frozen_string_literal: true

class UserAuthorizedNotification < ApplicationNotification
  deliver_by :mixcoin_plus_bot, class: 'DeliveryMethods::MixcoinPlusBot', category: 'PLAIN_TEXT'

  def message
    t('.message')
  end

  def data
    message
  end
end
