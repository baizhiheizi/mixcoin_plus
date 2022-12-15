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
class AppletPandoRingsTrigger < AppletTrigger
  store :params, accessors: %i[
    asset_id
    target_index
    target_value
    compare_action
  ]

  validates :target_index, inclusion: { in: %w[supply_apy supply_volume borrow_apy borrow_volume] }
  validates :compare_action, inclusion: { in: %w[larger_than less_than] }
  validates :target_value, numericality: true

  def asset
    @asset = MixinAsset.find_by asset_id: asset_id
  end

  def markets
    @markets = PandoRings.api.markets
  end

  def market
    @market = markets.find(&->(market) { market['asset_id'] == asset_id })
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
      when 'supply_apy'
        market['supply_rate'].to_f
      when 'supply_volume'
        market['ctokens'].to_f
      when 'borrow_apy'
        market['borrow_rate'].to_f
      when 'borrow_volume'
        market['total_borrows'].to_f
      end
  end

  def compare_action_symbol
    {
      larger_than: '>=',
      less_than: '<='
    }[compare_action.to_sym]
  end

  def alert_text
    case target_index
    when 'supply_apy', 'borrow_apy'
      "#{target_index.split('_').first.capitalize} APY of #{asset.symbol} in Pando Rings(= #{format('%.2f', current_value * 100)}%) #{compare_action_symbol} #{format('%.2f', target_value.to_f * 100)}%"
    when 'supply_volume', 'borrow_volume'
      "#{target_index.humanize} of #{asset.symbol} in Pando Rings(= #{current_value}) #{compare_action_symbol} #{target_value}"
    end
  end

  def description
    case target_index
    when 'supply_apy', 'borrow_apy'
      "#{target_index.split('_').first.capitalize} APY of #{asset.symbol} in Pando Rings #{compare_action_symbol} #{format('%.2f', target_value.to_f * 100)}%"
    when 'supply_volume', 'borrow_volume'
      "#{target_index.humanize} of #{asset.symbol} in Pando Rings #{compare_action_symbol} #{target_value}"
    end
  end
end
