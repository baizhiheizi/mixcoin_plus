# frozen_string_literal: true

module Mutations
  class ArchiveAppletMutation < Mutations::AuthorizedMutation
    argument :applet_id, ID, required: true

    type Types::AppletType

    def resolve(**params)
      applet = current_user.applets.find(params[:applet_id])
      applet.archive!
      applet.reload
    end
  end
end
