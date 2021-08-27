# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_activities
#
#  id               :uuid             not null, primary key
#  state            :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  applet_action_id :uuid             not null
#
# Indexes
#
#  index_applet_activities_on_applet_action_id  (applet_action_id)
#
class AppletActivity < ApplicationRecord
  include AASM

  belongs_to :applet_action

  has_many :transfers, class_name: 'MixinTransfer', as: :source, dependent: :restrict_with_exception

  delegate :applet, to: :applet_action

  aasm column: :state do
    state :drafted, initial: true
    state :failed
    state :completed

    event :fail do
      transitions from: :drafted, to: :failed
    end

    event :complete do
      transitions from: :drafted, to: :completed
    end
  end
end