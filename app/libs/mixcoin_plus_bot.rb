# frozen_string_literal: true

module MixcoinPlusBot
  ICON_URL = 'https://mixin-images.zeromesh.net/QesS8-z69oJBMiY2MTmCIBBZJFlgwfZaqHdNv2ejxNo534QLKIdP8fr_anco927kERbLAsY9NbJOyvtf-EU7RTDL1QDOcmcInpK1=s256'

  def self.api
    @api ||= MixinBot::API.new(
      client_id: Rails.application.credentials.dig(:mixin, :client_id),
      client_secret: Rails.application.credentials.dig(:mixin, :client_secret),
      session_id: Rails.application.credentials.dig(:mixin, :session_id),
      pin_token: Rails.application.credentials.dig(:mixin, :pin_token),
      private_key: Rails.application.credentials.dig(:mixin, :private_key)
    )
  end

  def self.app_statistic
    {
      users_count: User.count,
      daily_active_users_count: User.where(last_active_at: (Time.current - 1.day)...Time.current).count,
      weekly_active_users_count: User.where(last_active_at: (Time.current - 1.week)...Time.current).count,
      monthly_active_users_count: User.where(last_active_at: (Time.current - 1.month)...Time.current).count,
      connected_applets_count: Applet.connected.count,
      applet_activities_count: AppletActivity.without_drafted.count,
      applet_activity_swap_orders_count: SwapOrder.where(type: %w[AppletActivitySwapOrder AppletActivityMixSwapOrder]).without_drafted.count,
      applet_activity_swap_orders_traded_total_usd: SwapOrder.where(type: %w[AppletActivitySwapOrder AppletActivityMixSwapOrder], state: :traded).sum('(1 - refund_amount / pay_amount) * pay_amount_usd'),
      valid_ocean_orders_count: OceanOrder.without_drafted.count,
      markets_count: Market.count,
      match_total_usd: OceanSnapshot.with_snapshot_type(:match_from_engine).sum(:amount_usd),
      fee_total_usd: MixinTransfer.with_transfer_type(:ocean_order_mixcoin_fee).sum(:amount_usd),
      invitation_commission_total_usd: MixinTransfer.with_transfer_type(:ocean_order_invitation_commission).sum(:amount_usd),
      group_owner_commission_total_usd: MixinTransfer.with_transfer_type(:ocean_order_group_owner_commission).sum(:amount_usd),
      unprocessed_snapshots_count: MixinNetworkSnapshot.unprocessed.count,
      unprocessed_transfers_count: MixinTransfer.unprocessed.count
    }
  end

  def self.app_statistic_24h
    {
      users_count: User.within_24h.count,
      connected_applets_count: Applet.within_24h.connected.count,
      applet_activities_count: AppletActivity.within_24h.without_drafted.count,
      applet_activity_swap_orders_count: AppletActivitySwapOrder.within_24h.without_drafted.count,
      applet_activity_swap_orders_traded_total_usd: SwapOrder.within_24h.where(type: %w[AppletActivitySwapOrder AppletActivityMixSwapOrder], state: :traded).sum('(1 - refund_amount / pay_amount) * pay_amount_usd'),
      valid_ocean_orders_count: OceanOrder.within_24h.without_drafted.count,
      markets_count: Market.within_24h.count,
      match_total_usd: OceanSnapshot.within_24h.with_snapshot_type(:match_from_engine).sum(:amount_usd),
      fee_total_usd: MixinTransfer.within_24h.with_transfer_type(:ocean_order_mixcoin_fee).sum(:amount_usd),
      invitation_commission_total_usd: MixinTransfer.within_24h.with_transfer_type(:ocean_order_invitation_commission).sum(:amount_usd),
      group_owner_commission_total_usd: MixinTransfer.within_24h.with_transfer_type(:ocean_order_group_owner_commission).sum(:amount_usd),
      unprocessed_snapshots_count: MixinNetworkSnapshot.within_24h.unprocessed.count,
      unprocessed_transfers_count: MixinTransfer.within_24h.unprocessed.count
    }
  end
end
