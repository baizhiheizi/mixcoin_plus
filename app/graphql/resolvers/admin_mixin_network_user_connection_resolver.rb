# frozen_string_literal: true

module Resolvers
  class AdminMixinNetworkUserConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :state, String, required: false
    argument :type, String, required: false
    argument :query, String, required: false

    type Types::MixinNetworkUserType.connection_type, null: false

    def resolve(**params)
      users = MixinNetworkUser.all

      state = params[:state] || 'all'
      users =
        case params[:state]
        when 'all'
          users
        when 'unready'
          users.where.not(state: :ready)
        else
          users.where(state: state)
        end

      users = users.where(type: params[:type]) if params[:type].present?

      query = params[:query].to_s.strip
      q_ransack = { id_eq: query, mixin_uuid_eq: query }
      users.ransack(q_ransack.merge(m: 'or')).result.order(created_at: :desc)
    end
  end
end
