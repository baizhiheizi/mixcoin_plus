# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_assets
#
#  id         :uuid             not null, primary key
#  name       :string
#  price_usd  :decimal(, )
#  raw        :jsonb            not null
#  symbol     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#  chain_id   :uuid
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
