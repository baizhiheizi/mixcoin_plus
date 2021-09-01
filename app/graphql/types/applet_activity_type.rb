# frozen_string_literal: true

module Types
  class AppletActivityType < Types::BaseModelObject
    field :id, ID, null: false
    field :state, String, null: false

    field :applet, Types::AppletType, null: false
    field :applet_action, Types::AppletActionType, null: false

    def applet_action
      BatchLoader::GraphQL.for(object.applet_action_id).batch do |applet_action_ids, loader|
        AppletAction.where(id: applet_action_ids).each { |applet_action| loader.call(applet_action.id, applet_action) }
      end
    end
  end
end
