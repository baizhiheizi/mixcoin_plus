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
class AppletExinLocalTrigger < AppletTrigger
  store :params, accessors: %i[
    description
    asset_id
    target_index
    target_value
    compare_action
  ]

  validates :target_index, inclusion: { in: %w[ask_price_cny bid_price_cny] }
  validates :compare_action, inclusion: { in: %w[larger_than less_than] }
  validates :target_value, numericality: true

  def asset
    @asset = MixinAsset.find_by asset_id: asset_id
  end

  def first_advertisement
    ExinLocal.api.advertisements(
      asset_id: asset_id,
      type: {
        ask_price_cny: 'buy',
        bid_price_cny: 'sell'
      }[target_index.to_sym]
    )['data'].first
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
    @current_value ||= first_advertisement['price'].to_f
  end
end
