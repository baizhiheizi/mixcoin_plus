# frozen_string_literal: true

module Types
  class AppletTriggerType < Types::BaseModelObject
    field :id, ID, null: false
    field :type, String, null: false

    field :applet, Types::AppletType, null: false

    def applet
      BatchLoader::GraphQL.for(object.applet_id).batch do |applet_ids, loader|
        Applet.where(applet_id: applet_ids).each { |applet| loader.call(applet.id, applet) }
      end
    end
  end
end
