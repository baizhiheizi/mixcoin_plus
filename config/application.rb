# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_mailbox/engine'
require 'action_text/engine'
require 'action_view/railtie'
require 'action_cable/engine'
# require "sprockets/railtie"
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MixcoinPlus
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    config.i18n.available_locales = %i[en zh-CN]
    config.i18n.default_locale = :en

    # reference:
    # https://stackoverflow.com/questions/49233769/is-there-a-way-to-prevent-safari-on-ios-from-clearing-the-cookies-for-a-website
    # https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_4_Reset_the_previous_cookie
    # https://api.rubyonrails.org/v5.2.1/classes/ActionDispatch/Session/CookieStore.html
    config.session_store :cookie_store, expire_after: 14.days, key: '_mixcoin_plus_session'

    # https://github.com/exAspArk/batch-loader#caching
    config.middleware.use BatchLoader::Middleware
  end
end
