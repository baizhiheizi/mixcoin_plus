# frozen_string_literal: true

class Ifttb::AppletDatetimeTriggersController < Ifttb::BaseController
  before_action :load_applet
  before_action :load_trigger, only: %i[edit update destroy]

  def new
    @trigger = @applet.applet_datetime_trigger || @applet.applet_triggers.new(type: 'AppletDatetimeTrigger')
    redirect_to edit_ifttb_applet_applet_datetime_trigger_path(@applet, @trigger) if @trigger.persisted?
  end

  def edit
    @trigger = @applet.applet_triggers.find params[:id]
  end

  def create
    @trigger = AppletDatetimeTrigger.new trigger_params.merge(applet: @applet)
    if @trigger.save
      redirect_to edit_ifttb_applet_path(@applet)
    else
      render :new
    end
  end

  def update
    @trigger = @applet.applet_triggers.find params[:id]
    @trigger.assign_attributes trigger_params

    if @trigger.save
      redirect_to edit_ifttb_applet_path(@applet)
    else
      render :edit
    end
  end

  def destroy
    @trigger.destroy
    redirect_to edit_ifttb_applet_path(@applet)
  end

  private

  def load_applet
    @applet = current_user.applets.find params[:applet_id]
    redirect_to edit_ifttb_applet_path(@applet) if @applet.connected?
  end

  def load_trigger
    @trigger = @applet.applet_triggers.find params[:id]
  end

  def trigger_params
    params
      .require(:applet_datetime_trigger)
      .permit(
        :minute,
        :hour,
        :day,
        :month,
        :wday
      )
  end
end
