# frozen_string_literal: true

# == Schema Information
#
# Table name: user_assets
#
#  id          :uuid             not null, primary key
#  balance     :decimal(, )      default(0.0)
#  balance_usd :decimal(, )      default(0.0)
#  raw         :json             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  asset_id    :uuid             not null
#  user_id     :uuid             not null
#
# Indexes
#
#  index_user_assets_on_asset_id  (asset_id)
#  index_user_assets_on_user_id   (user_id)
#
require 'test_helper'

class UserAssetTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
