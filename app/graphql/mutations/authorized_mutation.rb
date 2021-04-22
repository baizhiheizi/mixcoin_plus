# frozen_string_literal: true

module Mutations
  class AuthorizedMutation < Mutations::BaseMutation
    def current_user
      context[:current_user]
    end

    def current_conversation
      MixinConversation.find_by conversation_id: context[:current_conversation_id]
    end

    def self.authorized?(_object, context)
      super && context[:current_user].present?
    end
  end
end
