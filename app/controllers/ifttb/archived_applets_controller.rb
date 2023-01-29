# frozen_string_literal: true

class Ifttb::ArchivedAppletsController < Ifttb::BaseController
  before_action :load_applet, only: %i[update destroy]

  def index
    @pagy, @applets = pagy current_user.applets.only_archived.order(updated_at: :desc)
  end

  def update
    @applet.archive!
    redirect_to ifttb_applet_path(@applet)
  end

  def destroy
    @applet.update archived_at: nil
    redirect_to ifttb_applet_path(@applet)
  end

  private

  def load_applet
    @applet = current_user.applets.find params[:id]
  end
end
