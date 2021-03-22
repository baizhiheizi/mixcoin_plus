# frozen_string_literal: true

# == Schema Information
#
# Table name: ocean_orders
#
#  id               :bigint           not null, primary key
#  filled_amount    :decimal(, )
#  filled_funds     :decimal(, )
#  maker_fee        :float            default(0.0)
#  order_type       :string
#  price            :decimal(, )
#  remaining_amount :decimal(, )
#  remaining_funds  :decimal(, )
#  side             :string
#  state            :string
#  taker_fee        :float            default(0.0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  base_asset_id    :uuid
#  broker_id        :uuid
#  conversation_id  :uuid
#  quote_asset_id   :uuid
#  trace_id         :uuid
#  user_id          :uuid
#
require 'test_helper'

class OceanOrderTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
