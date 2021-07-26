# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_messages
#
#  id                      :uuid             not null, primary key
#  category                :string
#  content(decrypted data) :string
#  processed_at            :datetime
#  raw                     :json
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  conversation_id         :uuid
#  message_id              :uuid
#  user_id                 :uuid
#
# Indexes
#
#  index_mixin_messages_on_message_id  (message_id) UNIQUE
#
class MixinMessage < ApplicationRecord
  store :raw, accessors: %i[action data]

  belongs_to :user, primary_key: :mixin_uuid, optional: true
  belongs_to :conversation, class_name: 'MixinConversation', primary_key: :conversation_id, inverse_of: false, optional: true

  before_validation :setup_attributes

  validates :message_id, presence: true, uniqueness: true
  validates :raw, presence: true

  after_commit :process_async, on: :create

  scope :unprocessed, -> { where(processed_at: nil) }

  def plain?
    /^PLAIN_/.match? category
  end

  def plain_text?
    category == 'PLAIN_TEXT'
  end

  def system_conversation?
    category == 'SYSTEM_CONVERSATION'
  end

  def private_conversation?
    conversation_id == MixcoinPlusBot.api.unique_uuid(user_id)
  end

  def processed?
    processed_at?
  end

  def process!
    return if processed?

    if plain_text?
      process_plain_text_message
    elsif plain?
      process_cs_message
    elsif system_conversation?
      process_system_conversation_message
    end

    touch_proccessed_at
  end

  def touch_proccessed_at
    update processed_at: Time.current
  end

  def process_async
    MixinMessageProcessWorker.perform_async id
  end

  def process_plain_text_message
    MixinConversation.find_or_create_by conversation_id: conversation_id
    base, quote = content.gsub(/@\d{10}/, '').strip.split(%r{/|\|,|-|_| })
    market =
      Market.ransack(
        {
          base_asset_symbol_i_cont_all: base,
          base_asset_symbol_not_cont_any: '-',
          quote_asset_symbol_i_cont_all: quote.presence || 'USDT',
          m: 'and'
        }
      ).result.first
    if market.blank?
      process_cs_message
    else
      msg =
        MixcoinPlusBot.api.app_card(
          conversation_id: conversation_id,
          recipient_id: user_id,
          data: {
            icon_url: MixcoinPlusBot::ICON_URL,
            title: "#{market.base_asset.symbol}/#{market.quote_asset.symbol}",
            description: 'Mixcoin',
            action: format('%<host>s/markets/%<market_id>s', host: Rails.application.credentials[:host], market_id: market.id)
          }
        )
      SendMixinMessageWorker.perform_async msg
    end
  end

  def process_system_conversation_message
    MixinConversation.refresh_or_create_by_conversation_id conversation_id
  end

  def process_cs_message
    if user_id == admin_mixin_uuid
      forward_to_user
    else
      forward_to_admin
    end
  end

  def admin_mixin_uuid
    Rails.application.credentials.fetch(:admin_mixin_uuid)
  end

  def forward_to_admin
    return if admin_mixin_uuid.blank?
    return unless private_conversation?
    return if content.in?(%w[Hi 你好])

    msg =
      MixcoinPlusBot.api.base_message_params(
        representative_id: user_id,
        category: category,
        data: content,
        recipient_id: admin_mixin_uuid,
        conversation_id: MixcoinPlusBot.api.unique_uuid(admin_mixin_uuid),
        message_id: MixcoinPlusBot.api.unique_uuid(message_id, admin_mixin_uuid)
      )

    SendMixinMessageWorker.perform_async msg
  end

  def forward_to_user
    return unless user_id == admin_mixin_uuid

    m = /@\d+/.match content
    return if m.blank?

    mention_id = m[0].gsub('@', '')
    recipient_id = User.find_by(mixin_id: mention_id)&.mixin_uuid
    recipient_id ||= MixcoinPlusBot.api.search_user(mention_id)['user_id']
    return if recipient_id.blank?

    msg =
      MixcoinPlusBot.api.base_message_params(
        category: category,
        data: content.gsub(/@\d+/, '').strip,
        recipient_id: recipient_id,
        conversation_id: MixcoinPlusBot.api.unique_uuid(recipient_id),
        message_id: MixcoinPlusBot.api.unique_uuid(message_id, recipient_id)
      )

    SendMixinMessageWorker.perform_async msg
  end

  private

  def setup_attributes
    return unless new_record?

    assign_attributes(
      content: Base64.decode64(raw['data']['data'].to_s),
      category: raw['data']['category'],
      user_id: raw['data']['user_id'],
      conversation_id: raw['data']['conversation_id']
    )
  end
end
