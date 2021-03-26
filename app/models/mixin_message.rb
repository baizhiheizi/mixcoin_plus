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

  before_validation :setup_attributes

  validates :message_id, presence: true, uniqueness: true
  validates :raw, presence: true

  after_commit :process_async, on: :create

  scope :unprocessed, -> { where(processed_at: nil) }

  def plain?
    /^PLAIN_/.match? category
  end

  def processed?
    processed_at?
  end

  def process!
    touch_proccessed_at
  end

  def touch_proccessed_at
    update processed_at: Time.current
  end

  def process_async
    if plain?
      # ProcessMixinMessageWorker.perform_async message_id
    else
      touch_proccessed_at
    end
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