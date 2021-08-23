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
class AppletDatetimeTrigger < AppletTrigger
  store :params, accessors: %i[
    description
    minute
    hour
    day
    month
    wday
  ]

  validates :minute, presence: true
  validates :hour, presence: true
  validates :day, presence: true
  validates :month, presence: true
  validates :wday, presence: true

  def match?
    case compare
    when 'before'
      Time.zone.parse(at) < Time.current
    when 'after'
      Time.zone.parse(at) > Time.current
    end
  end
end
