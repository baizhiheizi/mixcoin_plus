# frozen_string_literal: true

class Ifttb::AppletMixSwapActionsController < Ifttb::BaseController
  before_action :load_applet
  before_action :load_action, only: %i[edit update destroy]
  before_action :load_assets, only: %i[new edit]

  def new
    @action = @applet.applet_actions.find_by(type: 'AppletMixSwapAction')
    @action ||=
      @applet
      .applet_actions
      .new(
        type: 'AppletMixSwapAction',
        pay_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
        fill_asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
        pay_amount: '10'
      )
    redirect_to edit_ifttb_applet_applet_MixSwap_action_path(@applet, @action) if @action.persisted?
  end

  def edit
  end

  def create
    @action = AppletMixSwapAction.new action_params
    redirect_to edit_ifttb_applet_path(@applet) if @action.save
  end

  def update
    @action.assign_attributes action_params

    if @action.save
      redirect_to edit_ifttb_applet_path(@applet)
    else
      render :edit
    end
  end

  def destroy
    @action.destroy unless @applet.drafted?
    redirect_to edit_ifttb_applet_path(@applet)
  end

  private

  def load_applet
    @applet = current_user.applets.find params[:applet_id]
    redirect_to edit_ifttb_applet_path(@applet) if @applet.connected?
  end

  def load_action
    @action = @applet.applet_actions.find params[:id]
  end

  def load_assets
    @mixin_assets =
      MixinAsset
      .includes(:chain_asset)
      .where(asset_id: MixSwap.api.tradable_asset_ids)
      .order(symbol: :asc)
  end

  def action_params
    params
      .require(:applet_mix_swap_action)
      .permit(
        :type,
        :applet_id,
        :pay_asset_id,
        :fill_asset_id,
        :pay_amount,
        :slippage
      )
  end
end
