# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_actions
#
#  id         :uuid             not null, primary key
#  params     :jsonb
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  applet_id  :uuid             not null
#
# Indexes
#
#  index_applet_actions_on_applet_id  (applet_id)
#
class AppletAction < ApplicationRecord
  belongs_to :applet, -> { unscope(where: :archived_at) }, inverse_of: :applet_actions

  has_many :applet_activities, dependent: :restrict_with_exception

  delegate :user, to: :applet

  def may_active?
    false
  end

  def active!
    return unless may_active?

    applet_activities.create!
  end
end
