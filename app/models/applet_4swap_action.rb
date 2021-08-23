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
  validates :pay_amount, presence: true
  validates :slippage, numericality: true

  def balance_sufficient?
  end
end
