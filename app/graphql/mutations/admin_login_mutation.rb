# frozen_string_literal: true

module Mutations
  class AdminLoginMutation < Mutations::BaseMutation
    argument :name, String, required: true
    argument :password, String, required: true

    type Boolean

    def resolve(name:, password:)
      admin = Administrator.find_by(name: name)
      return unless admin&.authenticate(password)

      context[:session][:current_admin_id] = admin.id
      true
    end
  end
end
