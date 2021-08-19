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
class AppletSwapAction < AppletAction
  store :params, accessors: %i[
    base_asset_id
    quote_asset_id
    side
    slippage
  ]

  validate :base_asset_id, presence: true
  validate :quote_asset_id, presence: true
  validate :side, exclusion: { in: %w[ask bid] }
  validate :slippage, numericality: true
end
