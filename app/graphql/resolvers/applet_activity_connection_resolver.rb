# frozen_string_literal: true

module Resolvers
  class AppletActivityConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :applet_id, ID, required: true
    argument :after, String, required: false

    type Types::AppletActivityType.connection_type, null: false

    def resolve(**params)
      current_user.applets.find(params[:applet_id]).applet_activities.without_drafted.order(created_at: :desc)
    end
  end
end
