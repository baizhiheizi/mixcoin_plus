# frozen_string_literal: true

class UserCreateBrokersWorker
  include Sidekiq::Worker
  sidekiq_options retry: true

  def perform(id)
    user = User.find(id)
    user.create_broker! if user.broker.blank?
    user.create_ifttb_broker! if user.ifttb_broker.blank?
  end
end
