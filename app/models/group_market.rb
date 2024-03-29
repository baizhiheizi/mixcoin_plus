# frozen_string_literal: true

# == Schema Information
#
# Table name: group_markets
#
#  id                    :uuid             not null, primary key
#  rank                  :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  market_id             :uuid             not null
#  mixin_conversation_id :uuid             not null
#
# Indexes
#
#  index_group_markets_on_market_id              (market_id)
#  index_group_markets_on_mixin_conversation_id  (mixin_conversation_id)
#
class GroupMarket < ApplicationRecord
  belongs_to :market
  belongs_to :mixin_conversation

  acts_as_list column: :rank
end
