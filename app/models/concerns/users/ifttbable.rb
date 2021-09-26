# frozen_string_literal: true

module Users::Ifttbable
  extend ActiveSupport::Concern

  included do
    has_one :ifttb_broker, as: :owner, dependent: :restrict_with_exception
    has_one :ifttb_profile, class_name: 'UserIfttbProfile', dependent: :restrict_with_exception
    has_many :ifttb_orders, dependent: :restrict_with_exception

    after_create :create_ifttb_profile
  end

  def ifttb_role
    ifttb_profile.role
  end

  def ifttb_upgrade_pro(period = 1.year)
    ifttb_profile.upgrade_pro(period)
  end

  def ifttb_free?
    ifttb_profile.free?
  end

  def ifttb_pro?
    ifttb_profile.pro?
  end

  def may_create_applet?
    ifttb_pro? || applets.without_archived.count < 3
  end

  def ifttb_pro_expired_at
    ifttb_profile.pro_expired_at
  end

  def ifttb_traded_swap_orders
    @ifttb_traded_swap_orders ||= swap_orders.where(type: %w[AppletActivitySwapOrder AppletActivityMixSwapOrder]).where(state: %i[traded rejected])
  end

  def ifttb_pay_assets
    return if ifttb_traded_swap_orders.blank?

    assets = MixinAsset.where asset_id: ifttb_traded_swap_orders.distinct.pluck(:pay_asset_id)

    @ifttb_pay_assets ||= assets.as_json.map do |asset|
      asset['icon_url'] = asset['raw']['icon_url']
      asset['pay_total'] = ifttb_pay_assets_total[asset['asset_id']].to_f
      asset['pay_total_usd'] = ifttb_pay_assets_total_usd[asset['asset_id']].to_f
      asset
    end
  end

  def ifttb_pay_assets_total
    return if ifttb_traded_swap_orders.blank?

    @ifttb_pay_assets_total = ifttb_traded_swap_orders.group(:pay_asset_id).sum('pay_amount - refund_amount')
  end

  def ifttb_pay_assets_total_usd
    return if ifttb_traded_swap_orders.blank?

    @ifttb_pay_assets_total_usd ||= ifttb_traded_swap_orders.group(:pay_asset_id).sum('(1 - refund_amount / pay_amount) * pay_amount_usd')
  end

  def ifttb_pay_total_usd
    return if ifttb_traded_swap_orders.blank?

    @ifttb_pay_total_usd ||= ifttb_pay_assets_total_usd.values.sum.to_f
  end

  def ifttb_fill_assets
    return if ifttb_traded_swap_orders.blank?

    assets = MixinAsset.where asset_id: ifttb_traded_swap_orders.distinct.pluck(:fill_asset_id)

    @ifttb_fill_assets ||= assets.as_json.map do |asset|
      asset['icon_url'] = asset['raw']['icon_url']
      asset['fill_total'] = ifttb_fill_assets_total[asset['asset_id']].to_f
      asset['fill_total_usd'] = (ifttb_fill_assets_total[asset['asset_id']] * asset['price_usd'].to_f).to_f
      asset
    end
  end

  def ifttb_fill_assets_total
    return if ifttb_traded_swap_orders.blank?

    @ifttb_fill_assets_total = ifttb_traded_swap_orders.group(:fill_asset_id).sum(:fill_amount)
  end

  def ifttb_fill_total_usd
    return if ifttb_traded_swap_orders.blank?

    @ifttb_fill_total_usd ||= ifttb_fill_assets.sum(&->(asset) { asset['fill_total_usd'] })
  end

  def ifttb_profit
    return if ifttb_traded_swap_orders.blank?

    ((ifttb_fill_total_usd / ifttb_pay_total_usd) - 1).to_f
  end

  def ifttb_stats
    {
      applet_activities_completed_count: applet_activities.completed.count,
      pay_assets: ifttb_pay_assets,
      pay_total_usd: ifttb_pay_total_usd,
      fill_assets: ifttb_fill_assets,
      fill_total_usd: ifttb_fill_total_usd,
      profit: ifttb_profit
    }
  end
end
