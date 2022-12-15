# frozen_string_literal: true

class Ifttb::AppletExinLocalTriggersController < Ifttb::BaseController
  before_action :load_applet
  before_action :load_trigger, only: %i[edit update destroy]
  before_action :load_assets, only: %i[new edit]

  def new
    @trigger = @applet.applet_triggers.find_by(type: 'AppletExinLocalTrigger')
    @trigger ||=
      @applet
      .applet_triggers
      .new(
        type: 'AppletExinLocalTrigger'
      )
    redirect_to edit_ifttb_applet_applet_4swap_trigger_path(@applet, @trigger) if @trigger.persisted?
  end

  def edit
  end

  def create
    @trigger = AppletExinLocalTrigger.new trigger_params
    redirect_to edit_ifttb_applet_path(@applet) if @trigger.save
  end

  def update
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

  def load_assets
    @mixin_assets =
      MixinAsset
      .includes(:chain_asset)
      .where(asset_id: ExinLocal.api.tradable_asset_ids)
      .order(symbol: :asc)
  end

  def trigger_params
    params
      .require(:applet_exin_local_trigger)
      .permit(
        :type,
        :applet_id,
        :asset_id,
        :target_index,
        :target_value,
        :compare_action
      )
  end
end
