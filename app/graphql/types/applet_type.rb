# frozen_string_literal: true

module Types
  class AppletType < Types::BaseModelObject
    field :id, ID, null: false
    field :number, String, null: true
    field :title, String, null: false
    field :connected, Boolean, null: false
    field :applet_activities_count, Int, null: false
    field :last_active_at, GraphQL::Types::ISO8601DateTime, null: true
    field :archived_at, GraphQL::Types::ISO8601DateTime, null: true

    field :profit, Float, null: true
    field :pay_asset, Types::MixinAssetType, null: true
    field :pay_total, Float, null: true
    field :pay_total_usd, Float, null: true
    field :fill_asset, Types::MixinAssetType, null: true
    field :fill_total, Float, null: true
    field :fill_total_usd, Float, null: true
    field :profit, Float, null: true

    field :user, Types::UserType, null: false
    field :applet_triggers, [Types::AppletTriggerUnion], null: true
    field :applet_actions, [Types::AppletActionUnion], null: true

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end
  end
end
