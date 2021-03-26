# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_assets
#
#  id         :uuid             not null, primary key
#  change_btc :float
#  change_usd :float
#  price_btc  :float
#  price_usd  :float
#  raw        :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#
# Indexes
#
#  index_mixin_assets_on_asset_id  (asset_id) UNIQUE
#
require 'test_helper'

class MixinAssetTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end