# frozen_string_literal: true

module Mutations
  class ToggleAppletConnectedMutation < Mutations::AuthorizedMutation
    argument :applet_id, ID, required: true

    type Types::AppletType

    def resolve(**params)
      applet = current_user.applets.find(params[:applet_id])
      applet.toggle_connected
      applet.reload
    end
  end
end
