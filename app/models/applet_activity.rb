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

  has_many :swap_orders, class_name: 'AppletActivitySwapOrder', dependent: :restrict_with_exception

  after_create :log_applet_active

  delegate :applet, to: :applet_action

  aasm column: :state do
    state :drafted, initial: true
    state :failed
    state :completed

    event :fail, after: :notify_state do
      transitions from: :drafted, to: :failed
    end

    event :complete, after: :notify_state do
      transitions from: :drafted, to: :completed
    end
  end

  def notify_state
    AppletActivityStateNotification.with(applet_activity: self).deliver(applet.user)
  end

  def log_applet_active
    applet.log_active
  end
end
