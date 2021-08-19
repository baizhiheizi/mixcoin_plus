# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_triggers
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
#  index_applet_triggers_on_applet_id  (applet_id)
#
class AppletCronTrigger < AppletTrigger
  store :params, accessors: %i[
    number
    unit
  ]

  def match?
    return true if ifttb_rule.last_active_at.blank?

    interval = Time.current - ifttb_rule.last_active_at
    case unit
    when 'minute'
      interval >= number.miniutes
    when 'hour'
      interval >= number.hours
    when 'day'
      interval >= number.day
    when 'week'
      interval >= number.week
    when 'month'
      interval >= number.month
    end
  end
end
