# frozen_string_literal: true

module Resolvers
  class CurrentConversationResolver < Resolvers::BaseResolver
    type Types::MixinConversationType, null: true

    def resolve
      MixinConversation.find_by conversation_id: context[:current_conversation_id]
    end
  end
end
