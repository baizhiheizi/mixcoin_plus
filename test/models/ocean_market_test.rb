# frozen_string_literal: true

# == Schema Information
#
# Table name: ocean_markets
#
#  id                 :uuid             not null, primary key
#  base_asset_symbol  :string
#  maker_turnover     :decimal(, )      default(0.0)
#  ocean_orders_count :integer          default(0)
#  quote_asset_symbol :string
#  taker_turnover     :decimal(, )      default(0.0)
#  turnover           :decimal(, )      default(0.0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  base_asset_id      :uuid
#  quote_asset_id     :uuid
#
# Indexes
#
#  index_ocean_markets_on_base_asset_id   (base_asset_id)
#  index_ocean_markets_on_quote_asset_id  (quote_asset_id)
#
require 'test_helper'

class OceanMarketTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end