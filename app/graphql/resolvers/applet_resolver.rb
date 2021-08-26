# frozen_string_literal: true

module Resolvers
  class AppletResolver < Resolvers::AuthorizedBaseResolver
    argument :id, ID, required: true

    type Types::AppletType, null: false

    def resolve(params)
      current_user.applets.find(params[:id])
    end
  end
end
