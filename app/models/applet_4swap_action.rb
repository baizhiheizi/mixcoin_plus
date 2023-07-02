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

  def pre_order
    # @pre_order ||= Foxswap.api.pre_order(
    #   pay_asset_id: pay_asset_id,
    #   fill_asset_id: fill_asset_id,
    #   funds: pay_amount
    # )&.[]('data')

    @pre_order ||=
      begin
        pairs = Rails.cache.fetch 'pando_lake_routes', expires_in: 5.seconds do
          PandoBot::Lake.api.pairs['data']['pairs']
        end

        routes ||= PandoBot::Lake::PairRoutes.new pairs
        routes.pre_order(
          input_asset: pay_asset_id,
          output_asset: fill_asset_id,
          input_amount: pay_amount.to_d
        ).with_indifferent_access
      rescue StandardError => e
        Rails.logger.error e
        nil
      end
  end

  def fill_amount
    @fill_amount ||= pre_order&.[]('amount')
  end

  def route_id
    @route_id ||= pre_order&.[]('routes')
  end

  def swap_market
    @swap_market ||= SwapMarket.new base_asset_id: fill_asset_id, quote_asset_id: pay_asset_id
  end

  def trigger_price
    trigger = applet.applet_triggers.find_by(type: 'Applet4swapTrigger')
    return swap_market.bid_price if trigger.blank?

    case trigger.target_index
    when 'bid_price'
      if trigger.base_asset_id == fill_asset_id && trigger.quote_asset_id == pay_asset_id
        trigger.target_value
      elsif trigger.base_asset_id == pay_asset_id && trigger.quote_asset_id == fill_asset_id
        1.0 / trigger.target_value
      else
        swap_market.bid_price
      end
    when 'ask_price'
      if trigger.base_asset_id == pay_asset_id && trigger.quote_asset_id == fill_asset_id
        1.0 / trigger.target_value
      elsif trigger.base_asset_id == fill_asset_id && trigger.quote_asset_id == pay_asset_id
        trigger.target_value
      else
        swap_market.bid_price
      end
    else
      swap_market.bid_price
    end
  end

  def minimum_fill
    raise 'cannot fetch pre order' if fill_amount.blank?

    ([fill_amount.to_f, (pay_amount / trigger_price.to_f).floor(8)].max * (1 - slippage)).floor(8)
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
    return unless FOX_SWAP_ENABLE

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
        min_amount: minimum_fill,
        route_id: route_id
      ).find_or_create_by(
        trace_id: activity.id
      )
    end
  end
end
