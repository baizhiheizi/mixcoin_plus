# frozen_string_literal: true

class Ifttb::AppletActionsController < Ifttb::BaseController
  before_action :load_applet

  private

  def load_applet
    @applet = Applet.find params[:applet_id]
  end
end
