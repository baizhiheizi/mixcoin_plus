# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # admin
    field :admin_login, mutation: Mutations::AdminLoginMutation

    # application
    field :switch_locale, mutation: Mutations::SwitchLocaleMutation
  end
end
