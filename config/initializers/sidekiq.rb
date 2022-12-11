# frozen_string_literal: true

Sidekiq.configure_server do |config|
  cron_file = 'config/sidekiq-cron.yml'
  Sidekiq::Cron::Job.load_from_hash YAML.load_file(cron_file) if File.exist?(cron_file) && Sidekiq.server?
  config[:poll_interval] = 10
end
