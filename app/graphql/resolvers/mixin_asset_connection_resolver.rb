# frozen_string_literal: true

module Resolvers
  class MixinAssetConnectionResolver < Resolvers::BaseResolver
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::MixinAssetType.connection_type, null: false

    def resolve(params)
      query = params[:query].to_s.strip
      q_ransack = { symbol_i_cont: query, name_i_cont: query }

      MixinAsset.ransack(q_ransack.merge(m: 'or')).result
    end
  end
end
