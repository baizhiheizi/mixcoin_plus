# frozen_string_literal: true

# == Schema Information
#
# Table name: markets
#
#  id                 :uuid             not null, primary key
#  ocean_orders_count :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  base_asset_id      :uuid
#  quote_asset_id     :uuid
#
# Indexes
#
#  index_markets_on_base_asset_id   (base_asset_id)
#  index_markets_on_quote_asset_id  (quote_asset_id)
#
require 'test_helper'

class MarketTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
