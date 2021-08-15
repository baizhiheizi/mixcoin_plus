# frozen_string_literal: true

module Resolvers
  class AdminUserConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false
    argument :query, String, required: false
    argument :order, String, required: false

    type Types::UserType.connection_type, null: false

    def resolve(**params)
      query = params[:query].to_s.strip
      q_ransack = { name_i_cont: query, mixin_id: query }
      users = User.ransack(q_ransack.merge(m: 'or')).result

      case params[:order]
      when 'active'
        users.order('last_active_at DESC NULLS LAST, created_at DESC')
      when 'orders'
        users.order(ocean_orders_count: :desc)
      when 'invitations'
        users.order(invitations_count: :desc)
      else
        users.order(created_at: :desc)
      end
    end
  end
end
