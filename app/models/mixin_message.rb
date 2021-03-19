# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_messages
#
#  id                      :bigint           not null, primary key
#  content(decrepted data) :string
#  processed_at            :datetime
#  raw                     :json
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
class MixinMessage < ApplicationRecord
  store :raw, accessors: %i[action category user_id conversation_id message_id]

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
    process_user_message
    touch_proccessed_at
  end

  def process_user_message
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

    self.content = Base64.decode64 raw['data']['data'].to_s
  end
end
