# frozen_string_literal: true

class AppletActiveWorker
  include Sidekiq::Worker
  sidekiq_options queue: :high, retry: 3

  def perform(id)
    Applet.connected.find_by(id: id)&.active!
  end
end
