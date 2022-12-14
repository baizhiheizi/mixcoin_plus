# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MixcoinPlus
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    config.time_zone = 'UTC'
    config.i18n.available_locales = %i[en zh-CN ko]
    config.i18n.default_locale = :en

    # reference:
    # https://stackoverflow.com/questions/49233769/is-there-a-way-to-prevent-safari-on-ios-from-clearing-the-cookies-for-a-website
    # https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_4_Reset_the_previous_cookie
    # https://api.rubyonrails.org/v5.2.1/classes/ActionDispatch/Session/CookieStore.html
    config.session_store :cookie_store, expire_after: 14.days, key: '_mixcoin_plus_session'

    # https://github.com/exAspArk/batch-loader#caching
    config.middleware.use BatchLoader::Middleware

    config.active_record.yaml_column_permitted_classes = [ActiveSupport::HashWithIndifferentAccess, Symbol]
  end
end
