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
class Invitation < ApplicationRecord
  belongs_to :invitor, class_name: 'User', counter_cache: true
  belongs_to :invitee, class_name: 'User'
end
