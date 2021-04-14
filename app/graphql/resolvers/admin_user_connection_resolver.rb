# frozen_string_literal: true

module Resolvers
  class AdminUserConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :query, String, required: false

    type Types::UserType.connection_type, null: false

    def resolve(**params)
      query = params[:query].to_s.strip
      q_ransack = { name_i_cont: query, mixin_id: query }
      User.order(created_at: :desc).ransack(q_ransack.merge(m: 'or')).result
    end
  end
end
