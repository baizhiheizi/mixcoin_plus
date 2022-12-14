# frozen_string_literal: true

class Ifttb::AppletActionsController < Ifttb::BaseController
  before_action :load_applet

  def index
  end

  def show
  end

  def new
  end

  def edit
  end

  def create
  end

  def update
  end

  def destroy
  end

  private

  def load_applet
    @applet = Applet.find params[:applet_id]
  end
end
