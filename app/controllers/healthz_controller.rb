# frozen_string_literal: true

class HealthzController < ApplicationController
  def index
    User.count

    render json: {}, status: :ok
  end
end
