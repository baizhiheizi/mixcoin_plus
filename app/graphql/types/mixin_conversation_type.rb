# frozen_string_literal: true

module Types
  class MixinConversationType < Types::BaseModelObject
    field :id, ID, null: false
    field :category, String, null: false
    field :conversation_id, String, null: false
    field :name, String, null: true
    field :code_id, String, null: true
    field :creator_id, String, null: true
    field :admin_uuids, [String], null: true
    field :participant_uuids, [String], null: false

    field :participants, [Types::UserType], null: true
    field :creator, Types::UserType, null: true

    def creator
      BatchLoader::GraphQL.for(object.creator_id).batch do |creator_ids, loader|
        User.where(mixin_uuid: creator_ids).each { |user| loader.call(user.mixin_uuid, user) }
      end
    end
  end
end
