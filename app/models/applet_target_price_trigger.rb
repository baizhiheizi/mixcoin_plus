# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_triggers
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
#  index_applet_triggers_on_applet_id  (applet_id)
#
class AppletTargetPriceTrigger < AppletTrigger
  store :params, accessors: %i[
    description
    base_asset_id
    quote_asset_id
    target_price
    side
    compare
  ]

  validates :base_asset_id, presence: true
  validates :quote_asset_id, presence: true
  validates :side, exclusion: { in: %w[ask bid] }
  validates :compare, exclusion: { in: %w[larger_than less_than] }
  validates :target_price, numericality: true

  delegate :base_asset, :quote_asset, to: :swap_market

  def swap_market
    @swap_market ||= SwapMarket.new base_asset_id: base_asset_id, quote_asset_id: quote_asset_id
  end

  def match?
    case compare
    when 'larger_than'
      target_price >= swap_market.current_price
    when 'less_than'
      target_price <= swap_market.current_price
    end
  end

  def current_price
    case side
    when 'ask'
      swap_market.ask_price
    when 'bid'
      swap_market.bid_price
    end
  end
end
