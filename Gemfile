# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '~> 3.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'rails', '~> 7'
gem 'sprockets-rails'
# Use postgresql as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma'
# AASM - State machines for Ruby classes (plain Ruby, ActiveRecord, Mongoid)
gem 'aasm'
# Allows to use ActiveRecord transactional callbacks outside of ActiveRecord models, literally everywhere in your application.
gem 'after_commit_everywhere'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'shakapacker'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Integration of React + Webpack + Rails + rails/webpacker including server-side rendering of React, enabling a better developer experience and faster client performance.
gem 'react_on_rails', '~> 13.3'
# Ruby implementation of GraphQL http://graphql-ruby.org
gem 'graphql'
# Powerful tool for avoiding N+1 DB or HTTP queries
gem 'batch-loader'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.0'
# Map Redis types directly to Ruby objects
gem 'redis-objects'
# This gem adds a Redis::Namespace class which can be used to namespace Redis keys. http://redis.io
gem 'redis-namespace'
# Use Active Model has_secure_password
gem 'bcrypt', '~> 3.1.7'
# I18n and L10n
# gem 'rails-i18n', '~> 6.x'
# A simple API wrapper for Mixin Network in Ruby
gem 'mixin_bot'
# Simple, efficient background processing for Ruby http://sidekiq.org
gem 'sidekiq', '~> 7.0'
# Scheduler / Cron for Sidekiq jobs
gem 'sidekiq-cron'
# Notifications for Ruby on Rails applications
gem 'noticed'
# Enumerated attributes with I18n and ActiveRecord/Mongoid support
gem 'enumerize'
# A ruby implementation of the RFC 7519 OAuth JSON Web Token (JWT) standard.
gem 'jwt'
# Object-based searching. http://ransack-demo.herokuapp.com
gem 'ransack'
# Store different kinds of actions (Like, Follow, Star, Block, etc.) in a single table via ActiveRecord Polymorphic Associations.
gem 'action-store'
# This acts_as extension provides the capabilities for sorting and reordering a number of objects in a list.
gem 'acts_as_list'
# The simplest way to group temporal data
gem 'groupdate'
# Tracking ⚠️ exceptions for Rails application and store them in database.
gem 'exception-track'
# time tools (cron, parsing, durations, ...)
gem 'fugit'
# Config helps you easily manage environment specific settings in an easy and usable manner.
gem 'config'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

# deploy
gem 'mina', '~> 1.2.2', require: false
gem 'mina-logs', '~> 1.1.0', require: false
gem 'mina-multistage', '~> 1.0.3', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 4.1.0'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'listen', '~> 3.3'
  gem 'rack-mini-profiler', '~> 2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  # Annotate Rails classes with schema and routes info
  gem 'annotate', require: false
  # A Ruby static code analyzer and formatter
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'mini_racer', platforms: :ruby
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
