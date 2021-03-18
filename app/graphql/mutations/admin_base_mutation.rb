# frozen_string_literal: true

module Mutations
  class AdminBaseMutation < Mutations::BaseMutation
    def current_admin
      @current_admin = Administrator.find_by id: context[:session][:current_admin_id]
    end

    def self.authorized?(_object, context)
      super && context[:session][:current_admin_id].present?
    end
  end
end
