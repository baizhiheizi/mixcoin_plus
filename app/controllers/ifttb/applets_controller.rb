# frozen_string_literal: true

class Ifttb::AppletsController < Ifttb::BaseController
  before_action :load_applet, only: %i[pend archive connect disconnect]

  def index
    @pagy, @applets = pagy current_user.applets.without_drafted.order(updated_at: :desc)
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

  def pend
    @applet.pend! if @applet.may_pend?

    redirect_to ifttb_applets_path if @applet.pending?
  end

  def archive
  end

  def connect
  end

  def disconnect
  end

  private

  def load_applet
    @applet = current_user.applets.find params[:applet_id]
  end
end
