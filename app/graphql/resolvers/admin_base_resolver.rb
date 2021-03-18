# frozen_string_literal: true

module Resolvers
  class AdminBaseResolver < Resolvers::BaseResolver
    def current_admin
      context[:current_admin]
    end

    def self.authorized?(_object, context)
      super && context[:session][:current_admin_id].present?
    end
  end
end
