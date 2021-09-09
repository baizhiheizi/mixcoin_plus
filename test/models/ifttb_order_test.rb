# frozen_string_literal: true

# == Schema Information
#
# Table name: ifttb_orders
#
#  id         :uuid             not null, primary key
#  amount     :decimal(, )
#  amount_usd :decimal(, )
#  order_type :string
#  state      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#  user_id    :uuid
#
# Indexes
#
#  index_ifttb_orders_on_user_id  (user_id)
#
require 'test_helper'

class IfttbOrderTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
