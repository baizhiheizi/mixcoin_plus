# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_actions
#
#  id         :uuid             not null, primary key
#  params     :jsonb
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  applet_id  :uuid             not null
#
# Indexes
#
#  index_applet_actions_on_applet_id  (applet_id)
#
class Applet4swapAction < AppletAction
  FOX_SWAP_ENABLE = Settings.foxswap.enable

  store :params, accessors: %i[
    description
    pay_asset_id
    fill_asset_id
    pay_amount
    slippage
  ]

  validates :pay_asset_id, presence: true
  validates :fill_asset_id, presence: true
  validates :pay_amount, presence: true, numericality: { greater_than_or_equal_to: 0.000_01 }
  validates :slippage, numericality: true

  def pay_asset
    @pay_asset ||= MixinAsset.find_by(asset_id: pay_asset_id)
  end

  def fill_asset
    @fill_asset ||= MixinAsset.find_by(asset_id: fill_asset_id)
  end

  def fill_amount
    @fill_amount ||= Foxswap.api.pre_order(
      pay_asset_id: pay_asset_id,
      fill_asset_id: fill_asset_id,
      funds: pay_amount
    )&.[]('data')&.[]('fill_amount')
  end

  def swap_market
    @swap_market ||= SwapMarket.new base_asset_id: fill_asset_id, quote_asset_id: pay_asset_id
  end

  def minimum_fill
    raise 'cannot fetch pre order' if fill_amount.blank?

    ([fill_amount.to_f, (pay_amount / swap_market.bid_price).floor(8)].max * (1 - slippage)).floor(8)
  end

  def may_active?
    if FOX_SWAP_ENABLE && balance_sufficient?
      true
    else
      applet.disconnect! if applet.connected?
      false
    end
  end

  def balance_sufficient?
    r = applet.user.ifttb_broker.mixin_api.asset pay_asset_id
    r['balance'].to_f >= pay_amount.to_f
  rescue StandardError
    false
  end

  def active!
    ActiveRecord::Base.transaction do
      activity = applet_activities.create!(applet_id: applet_id)

      activity.swap_orders.create_with(
        type: 'AppletActivitySwapOrder',
        user_id: user.id,
        applet_activity_id: activity.id,
        broker: user.ifttb_broker,
        pay_asset_id: pay_asset_id,
        pay_amount: pay_amount.to_f,
        fill_asset_id: fill_asset_id,
        min_amount: minimum_fill
      ).find_or_create_by(
        trace_id: activity.id
      )
    end
  end
end
