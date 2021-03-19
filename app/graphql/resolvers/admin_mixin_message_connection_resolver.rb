# frozen_string_literal: true

module Resolvers
  class AdminMixinMessageConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::MixinMessageType.connection_type, null: false

    def resolve(*)
      MixinMessage.all
    end
  end
end
