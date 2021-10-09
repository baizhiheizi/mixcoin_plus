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
class AppletAlertAction < AppletAction
  store :params, accessors: %i[
    description
    data
    via
  ]

  def may_active?
    true
  end

  def active!
    ActiveRecord::Base.transaction do
      activity = applet_activities.create!(applet_id: applet_id)
      activity.complete!
    end
  end
end
