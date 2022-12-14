# frozen_string_literal: true

class Ifttb::AppletsController < Ifttb::BaseController
  def index
  end

  def show
  end

  def new
    if current_user.may_create_applet?
      drafted_applet = current_user.applets.drafted.first
      drafted_applet ||= current_user.applets.create

      redirect_to edit_ifttb_applet_path(drafted_applet)
    else
      redirect_to ifttb_applets_path
    end
  end

  def edit
    @applet = current_user.applets.find_by id: params[:id]
  end

  def create
  end

  def update
  end

  def destroy
  end

  private

  def load_applet
  end
end
