# frozen_string_literal: true

class Ifttb::Applet4swapTriggersController < Ifttb::BaseController
  before_action :load_applet
  before_action :load_trigger, only: %i[edit update destroy]
  before_action :load_assets, only: %i[new edit]

  def new
    @trigger = @applet.applet_triggers.find_by(type: 'Applet4swapTrigger')
    @trigger ||=
      @applet
      .applet_triggers
      .new(
        type: 'Applet4swapTrigger',
        base_asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
        quote_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
        target_index: 'ask_price',
        compare_action: 'larger_than',
        target_value: '100000'
      )
    redirect_to edit_ifttb_applet_applet_4swap_trigger_path(@applet, @trigger) if @trigger.persisted?
  end

  def edit
  end

  def create
    @trigger = Applet4swapTrigger.new trigger_params
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
    @trigger.destroy if @applet.drafted? || @applet.applet_triggers.count > 1
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
      .where(asset_id: Foxswap.api.tradable_asset_ids)
      .order(symbol: :asc)
  end

  def trigger_params
    params
      .require(:applet_4swap_trigger)
      .permit(
        :type,
        :applet_id,
        :base_asset_id,
        :quote_asset_id,
        :target_index,
        :target_value,
        :compare_action
      )
  end
end
