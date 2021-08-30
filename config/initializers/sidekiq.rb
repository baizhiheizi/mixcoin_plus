# frozen_string_literal: true

Sidekiq.configure_server do |config|
  config.redis = { namespace: 'mixcoin_plus_sidekiq' }

  cron_file = 'config/sidekiq-cron.yml'
  Sidekiq::Cron::Job.load_from_hash YAML.load_file(cron_file) if File.exist?(cron_file) && Sidekiq.server?
  Sidekiq.options[:poll_interval] = 10
end

Sidekiq.configure_client do |config|
  config.redis = { namespace: 'mixcoin_plus_sidekiq' }
end

Applet.connected.map(&:create_cron_job) if Sidekiq.server?
