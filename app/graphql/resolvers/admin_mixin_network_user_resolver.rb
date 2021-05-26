# frozen_string_literal: true

module Resolvers
  class AdminMixinNetworkUserResolver < Resolvers::AdminBaseResolver
    argument :mixin_uuid, String, required: true

    type Types::MixinNetworkUserType, null: false

    def resolve(mixin_uuid:)
      MixinNetworkUser.find_by mixin_uuid: mixin_uuid
    end
  end
end
