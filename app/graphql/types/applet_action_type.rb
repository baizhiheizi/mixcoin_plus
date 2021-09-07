# frozen_string_literal: true

module Types
  class AppletActionType < Types::BaseModelObject
    field :id, ID, null: false
    field :type, String, null: false
    field :description, String, null: true
    # field :params, GraphQL::Types::JSON, null: false

    field :applet, Types::AppletType, null: false

    def applet
      BatchLoader::GraphQL.for(object.applet_id).batch do |applet_ids, loader|
        Applet.where(id: applet_ids).each { |applet| loader.call(applet.id, applet) }
      end
    end
  end
end
