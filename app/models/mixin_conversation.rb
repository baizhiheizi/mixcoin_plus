# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_conversations
#
#  id                :uuid             not null, primary key
#  category          :string
#  data              :json
#  name              :string
#  participant_uuids :uuid             default([]), is an Array
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  code_id           :uuid
#  conversation_id   :uuid             not null
#  creator_id        :uuid
#
# Indexes
#
#  index_mixin_conversations_on_conversation_id  (conversation_id) UNIQUE
#  index_mixin_conversations_on_creator_id       (creator_id)
#
class MixinConversation < ApplicationRecord
  belongs_to :creator, class_name: 'User', primary_key: :mixin_uuid, optional: true

  has_many :ocean_orders, foreign_key: :conversation_id, primary_key: :conversation_id, inverse_of: :conversation, dependent: :restrict_with_exception
  has_many :group_markets, dependent: :restrict_with_exception
  has_many :markets, through: :group_markets

  before_validation :set_defaults, on: :create

  validates :data, presence: true
  validates :conversation_id, presence: true, uniqueness: true

  scope :only_group, -> { where(category: 'GROUP') }

  def participants
    @participants = User.where(mixin_uuid: participant_uuids)
  end

  def admin_uuids
    data['participants']
      .filter(&->(participant) { participant['role'].in? %w[ADMIN OWNER] })
      .map(&->(participant) { participant['user_id'] })
  end

  def group?
    category == 'GROUP'
  end

  def refresh!
    r = MixcoinPlusBot.api.read_conversation conversation_id
    return if r['data'].blank?

    update! data: r['data']
  end

  def refresh_async
    MixinConversationRefreshWorker.perform_async id
  end

  def self.refresh_or_create_by_conversation_id(_conversation_id)
    find_by(conversation_id: _conversation_id)&.refresh_async || create!(conversation_id: _conversation_id)
  end

  private

  def set_defaults
    read_conversation if data.blank?

    assign_attributes(
      conversation_id: data['conversation_id'],
      creator_id: data['creator_id'],
      category: data['category'],
      code_id: data['code_id'],
      name: data['name'],
      participant_uuids: data['participants'].map(&->(participant) { participant['user_id'] })
    )
  end

  def read_conversation
    r = MixcoinPlusBot.api.read_conversation conversation_id
    return if r['data'].blank?

    self.data = r['data']
  end
end
