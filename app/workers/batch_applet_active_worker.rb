# frozen_string_literal: true

class BatchAppletActiveWorker
  include Sidekiq::Worker
  sidekiq_options queue: :high, retry: false

  def perform
    Applet.connected.active_async
  end
end
