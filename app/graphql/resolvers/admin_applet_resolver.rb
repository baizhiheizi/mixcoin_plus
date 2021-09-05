# frozen_string_literal: true

module Resolvers
  class AdminAppletResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::AppletType, null: false

    def resolve(**params)
      Applet.find(params[:id])
    end
  end
end
