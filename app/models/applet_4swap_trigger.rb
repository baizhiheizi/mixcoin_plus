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
class Applet4swapTrigger < AppletTrigger
  store :params, accessors: %i[
    description
    base_asset_id
    quote_asset_id
    target_index
    target_value
    compare_action
  ]

  validates :base_asset_id, presence: true
  validates :quote_asset_id, presence: true
  validates :target_index, inclusion: { in: %w[ask_price bid_price] }
  validates :compare_action, inclusion: { in: %w[larger_than less_than] }
  validates :target_value, numericality: true

  delegate :base_asset, :quote_asset, to: :swap_market

  def swap_market
    @swap_market ||= SwapMarket.new base_asset_id: base_asset_id, quote_asset_id: quote_asset_id
  end

  def match?
    return false if current_value.blank?

    case compare_action
    when 'larger_than'
      current_value >= target_value
    when 'less_than'
      current_value <= target_value
    end
  end

  def current_value
    @current_value ||=
      case target_index
      when 'ask_price'
        swap_market.ask_price
      when 'bid_price'
        swap_market.bid_price
      end
  end
end
