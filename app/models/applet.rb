# frozen_string_literal: true

# == Schema Information
#
# Table name: applets
#
#  id             :uuid             not null, primary key
#  connected      :boolean          default(FALSE)
#  last_active_at :datetime
#  title          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid             not null
#
class Applet < ApplicationRecord
  belongs_to :user

  has_many :applet_triggers, dependent: :restrict_with_exception
  has_many :applet_activities, dependent: :restrict_with_exception
  has_many :applet_activities, dependent: :restrict_with_exception

  def may_active?
    applet_triggers.map(&:match?).all?(true)
  end

  def active!
    return unless may_active?
  end

  def connect!
    update connected: true
  end

  def disconnect!
    update connected: false
  end
end
