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

  delegate :next_time, to: :cron_instance
  delegate :previous_time, to: :cron_instance

  def cron_value
    [minute, hour, day, month, wday].join(' ')
  end

  def cron_instance
    @cron_instance ||= Fugit.parse_cron cron_value
  end

  def frequency
    cron_instance.rough_frequency
  end

  def match?
    return true if applet.last_active_at.blank?

    Time.curent.to_i - applet.last_active_at.to_i > frequency
  end
end
