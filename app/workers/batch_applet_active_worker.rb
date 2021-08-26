# frozen_string_literal: true

class BatchAppletActiveWorker
  include Sidekiq::Worker
  sidekiq_options queue: :high, retry: false

  def perform
    Applet.connected.map(&:active_async)
  end
end
