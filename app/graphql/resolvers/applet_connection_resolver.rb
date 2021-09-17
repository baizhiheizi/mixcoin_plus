# frozen_string_literal: true

module Resolvers
  class AppletConnectionResolver < Resolvers::AuthorizedBaseResolver
    argument :filter, String, required: false
    argument :after, String, required: false

    type Types::AppletType.connection_type, null: false

    def resolve(**params)
      applets = current_user.applets.order(created_at: :desc)

      case params[:filter]&.to_sym
      when :archived
        applets.only_archived
      else
        applets.without_archived
      end
    end
  end
end
