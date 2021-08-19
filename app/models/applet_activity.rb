# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_activities
#
#  id               :uuid             not null, primary key
#  result           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  applet_action_id :uuid             not null
#
# Indexes
#
#  index_applet_activities_on_applet_action_id  (applet_action_id)
#
class AppletActivity < ApplicationRecord
  belongs_to :applet_action

  delegate :applet, to: :applet_action

  after_create :process_async

  def process!
  end

  def process_async
  end
end
