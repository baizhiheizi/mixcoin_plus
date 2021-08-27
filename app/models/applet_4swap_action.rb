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
    )&.[]('data')&.[]('fill_amount')&.to_f
  end

  def minimum_fill
    (fill_amount * (1 - slippage)).floor(8)
  end

  def may_active?
    if balance_sufficient?
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
    return unless may_active?

    ActiveRecord::Base.transaction do
      activity = applet_activities.create!

      activity.transfers.create_with(
        wallet: user.ifttb_broker,
        transfer_type: :applet_4swap_action,
        priority: :critical,
        opponent_multisig: {
          receivers: SwapOrder::FSWAP_MTG_MEMBERS,
          threshold: SwapOrder::FSWAP_MTG_THRESHOLD
        },
        asset_id: pay_asset_id,
        amount: pay_amount.to_f,
        memo: fswap_mtg_memo(activity.id)
      ).find_or_create_by!(
        trace_id: activity.id
      )

      applet.log_active
    end
  end

  def fswap_mtg_memo(trace_id)
    r = Foxswap.api.actions(
      user_id: user.mixin_uuid,
      follow_id: trace_id,
      asset_id: fill_asset_id,
      minimum_fill: minimum_fill.present? ? format('%.8f', minimum_fill) : nil
    )

    r['data']['action']
  end
end