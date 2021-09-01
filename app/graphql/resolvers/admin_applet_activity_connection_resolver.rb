# frozen_string_literal: true

module Resolvers
  class AdminAppletActivityConnectionResolver < Resolvers::AdminBaseResolver
    argument :state, String, required: false
    argument :applet_id, ID, required: false
    argument :user_id, ID, required: false
    argument :after, String, required: false

    type Types::AppletActivityType.connection_type, null: false

    def resolve(**params)
      user = User.find_by(id: params[:id])
      applet = Applet.with_archived.find_by(id: params[:applet_id])

      applet_activities =
        if user.present?
          user.applet_activities
        elsif applet.present?
          applet.applet_activities
        else
          AppletActivity.all
        end

      applet_activities =
        case params[:state]
        when 'drafted'
          applet_activities.drafted
        when 'failed'
          applet_activities.failed
        when 'completed'
          applet_activities.completed
        else
          applet_activities
        end

      applet_activities.order(created_at: :desc)
    end
  end
end
