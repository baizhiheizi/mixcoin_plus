# frozen_string_literal: true

module Resolvers
  class AdminAppletConnectionResolver < Resolvers::AdminBaseResolver
    argument :filter, String, required: false
    argument :user_id, ID, required: false
    argument :after, String, required: false

    type Types::AppletType.connection_type, null: false

    def resolve(**params)
      applets =
        case params[:filter]
        when 'all'
          Applet.with_archived
        when 'archived'
          Applet.only_archived
        when 'connected'
          Applet.connected
        else
          Applet.all
        end

      applets = applets.where(user_id: params[:user_id]) if params[:user_id].present?

      applets.order(created_at: :desc)
    end
  end
end
