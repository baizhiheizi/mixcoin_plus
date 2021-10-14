# frozen_string_literal: true

require 'csv'

MixinBot.scope = Settings.mixin&.scope
# MixinBot.api_host = 'mixin-api.zeromesh.net' if Rails.env.development?
# MixinBot.blaze_host = 'mixin-blaze.zeromesh.net' if Rails.env.development?
