# frozen_string_literal: true

module Types
  class AppletType < Types::BaseModelObject
    field :id, ID, null: false
    field :title, String, null: false
    field :connected, Boolean, null: false
    field :last_active_at, GraphQL::Types::ISO8601DateTime, null: true
    field :archived_at, GraphQL::Types::ISO8601DateTime, null: true

    field :user, Types::UserType, null: false
    field :applet_triggers, [Types::AppletTriggerUnion], null: true
    field :applet_actions, [Types::AppletActionUnion], null: true

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(user_id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end
  end
end
