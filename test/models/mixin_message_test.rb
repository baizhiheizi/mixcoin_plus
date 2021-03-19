# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_messages
#
#  id                      :bigint           not null, primary key
#  content(decrepted data) :string
#  processed_at            :datetime
#  raw                     :json
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
require 'test_helper'

class MixinMessageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
