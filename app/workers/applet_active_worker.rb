# frozen_string_literal: true

class AppletActiveWorker
  include Sidekiq::Worker
  sidekiq_options queue: :high, retry: false

  def perform(id)
    Applet.find(id).active!
  end
end
