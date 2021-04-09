# frozen_string_literal: true

module Resolvers
  class AdminMixinConversationResolver < Resolvers::AdminBaseResolver
    argument :id, ID, required: true

    type Types::MixinConversationType, null: false

    def resolve(id:)
      MixinConversation.find_by id: id
    end
  end
end
