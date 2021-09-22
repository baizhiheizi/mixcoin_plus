# frozen_string_literal: true

module Mutations
  class DownloadAppletSwapOrdersMutation < Mutations::AuthorizedMutation
    argument :applet_id, ID, required: true

    type Boolean

    def resolve(**params)
      return unless current_user.ifttb_pro?

      current_user.applets.find(params[:applet_id]).download_traded_swap_orders_async
    end
  end
end
