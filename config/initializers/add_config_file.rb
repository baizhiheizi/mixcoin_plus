# frozen_string_literal: true

if ENV['CONFIG_FILE'].present?
  Settings.add_source! ENV['CONFIG_FILE']
  Settings.reload!
end
