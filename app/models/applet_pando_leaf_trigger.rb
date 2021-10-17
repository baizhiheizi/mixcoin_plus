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
class AppletPandoLeafTrigger < AppletTrigger
  store :params, accessors: %i[
    description
    asset_id
    target_index
    target_value
    compare_action
  ]

  validates :target_index, inclusion: { in: %w[biding_flips oracle_next_price] }
  validates :compare_action, inclusion: { in: %w[larger_than less_than present] }
  validates :target_value, numericality: true, unless: proc { |trigger| trigger.target_index == 'biding_flips' }

  def asset
    @asset = MixinAsset.find_by asset_id: asset_id
  end

  def oracle
    @oracle = PandoLeaf.api.oracle(asset_id)['data']
  end

  def biding_flips
    flips = PandoLeaf.api.flips['data']['flips']
    flips = flips.reject(&->(flip) { flip['action'] == 'FlipDeal' })

    if asset_id.present?
      flips.filter(&->(flip) { flip['collateral_id'] == collateral['id'] })
    else
      flips
    end
  end

  def collateral
    @collateral = PandoLeaf.api.cats['data']['collaterals'].find(&->(cat) { cat['gem'] == asset_id })
  end

  def match?
    return false if current_value.blank?

    case compare_action
    when 'larger_than'
      current_value >= target_value
    when 'less_than'
      current_value <= target_value
    when 'present'
      current_value.present?
    end
  end

  def current_value
    @current_value ||=
      case target_index
      when 'biding_flips'
        biding_flips
      when 'oracle_next_price'
        oracle['next'].to_f
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
    when 'biding_flips'
      "Pando Leaf has #{biding_flips.size} ongoing auctions for collateral of #{asset&.symbol.presence || 'any asset'}"
    when 'oracle_next_price'
      "Next price of #{asset.symbol} from Pando Leaf oracle(#{current_value}) #{compare_action_symbol} #{target_value}"
    end
  end
end
