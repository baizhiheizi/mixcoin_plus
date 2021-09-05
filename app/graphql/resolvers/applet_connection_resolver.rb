# frozen_string_literal: true

module Resolvers
  class AppletConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :after, String, required: false

    type Types::AppletType.connection_type, null: false

    def resolve(**_params)
      current_user.applets.without_archived.order(created_at: :desc)
    end
  end
end
