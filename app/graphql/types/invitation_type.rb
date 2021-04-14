# frozen_string_literal: true

module Types
  class InvitationType < Types::BaseModelObject
    field :id, ID, null: false
    field :invitee_id, String, null: false
    field :invitor_id, String, null: false

    field :invitor, Types::UserType, null: false
    field :invitee, Types::UserType, null: false

    def invitor
      BatchLoader::GraphQL.for(object.invitor_id).batch do |invitor_ids, loader|
        User.where(id: invitor_ids).each { |user| loader.call(user.id, user) }
      end
    end

    def invitee
      BatchLoader::GraphQL.for(object.invitee_id).batch do |invitee_ids, loader|
        User.where(id: invitee_ids).each { |user| loader.call(user.id, user) }
      end
    end
  end
end
