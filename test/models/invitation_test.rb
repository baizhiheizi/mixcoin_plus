# frozen_string_literal: true

# == Schema Information
#
# Table name: invitations
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  invitee_id :uuid
#  invitor_id :uuid
#
# Indexes
#
#  index_invitations_on_invitee_id  (invitee_id) UNIQUE
#  index_invitations_on_invitor_id  (invitor_id)
#
require 'test_helper'

class InvitationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
