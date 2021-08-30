# frozen_string_literal: true

class ApplicationNotification < Noticed::Base
  OHMY_ICON_URL = 'https://mixin-images.zeromesh.net/yxEB0t8dQoz39PGo-mF_TXCe3jwMNBL1ebg1f4L7jxY5IBn7aoBA3gVpPUaePULvdDDQb-GoBnsSh2R5MhRMzw=s256'

  private

  def bot
    'MixcoinPlusBot'
  end

  def message
  end

  def url
  end

  def recipient_messenger?
    recipient.messenger?
  end

  def with_locale(&action)
    locale = recipient&.locale || I18n.default_locale
    I18n.with_locale(locale, &action)
  end
end
