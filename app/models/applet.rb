# frozen_string_literal: true

# == Schema Information
#
# Table name: applets
#
#  id             :uuid             not null, primary key
#  archived_at    :datetime
#  connected      :boolean          default(FALSE)
#  frequency      :integer          default(300)
#  last_active_at :datetime
#  title          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid             not null
#
class Applet < ApplicationRecord
  belongs_to :user

  has_many :applet_triggers, dependent: :restrict_with_exception
  has_many :applet_actions, dependent: :restrict_with_exception
  has_many :applet_activities, through: :applet_actions, dependent: :restrict_with_exception

  accepts_nested_attributes_for :applet_triggers, :applet_actions

  before_validation :set_defaults

  validate :must_has_triggers, on: :create
  validate :must_has_actions, on: :create

  scope :connected, -> { where(connected: true) }
  scope :only_archived, -> { unscope(where: :archived_at).where.not(archived_at: nil) }
  scope :with_archived, -> { unscope(where: :archived_at) }
  default_scope { where(archived_at: nil) }

  def may_active?
    applet_triggers.map(&:match?).all?(true)
  end

  def active!
    return unless may_active?

    applet_actions.map(&:active!)
  end

  def active_async
    AppletActiveWorker.perform_async id
  end

  def may_connect?
    applet_actions.map(&:may_active?).all?(true)
  end

  def connect!
    return unless may_connect?

    update connected: true
  end

  def disconnect!
    update connected: false
  end

  def toggle_connected
    if connected?
      disconnect!
    else
      connect!
    end
  end

  def log_active
    touch :last_active_at
  end

  def archive!
    update! archived_at: Time.current
  end

  private

  def set_defaults
    self.frequency = applet_triggers.map(&:frequency).min || 300
  end

  def must_has_triggers
    errors.add(:applet_triggers, ' must have') if applet_triggers.blank?
  end

  def must_has_actions
    errors.add(:applet_actions, ' must have') if applet_actions.blank?
  end
end