# frozen_string_literal: true

module Resolvers
  class AdminMixinConversationConnectionResolver < Resolvers::AdminBaseResolver
    argument :category, String, required: false
    argument :after, String, required: false

    type Types::MixinConversationType.connection_type, null: false

    def resolve(**_params)
      MixinConversation.only_group.order(created_at: :desc)
    end
  end
end
