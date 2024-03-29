# frozen_string_literal: true

module Resolvers
  class AdminMixinMessageConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::MixinMessageType.connection_type, null: false

    def resolve(*)
      MixinMessage.all.order(created_at: :desc)
    end
  end
end
