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
#  applet_id        :uuid
#
# Indexes
#
#  index_applet_activities_on_applet_action_id  (applet_action_id)
#  index_applet_activities_on_applet_id         (applet_id)
#
class AppletActivity < ApplicationRecord
  include AASM

  belongs_to :applet, counter_cache: true
  belongs_to :applet_action

  has_many :swap_orders, dependent: :restrict_with_exception

  after_create :log_applet_active

  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }
  scope :without_drafted, -> { where.not(state: :drafted) }

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
    return if applet&.user.blank?

    AppletActivityStateNotification.with(applet_activity: self).deliver(applet.user)
  end

  def log_applet_active
    applet.log_active
  end
end
