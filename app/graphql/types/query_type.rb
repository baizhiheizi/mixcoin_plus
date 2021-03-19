# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :current_admin, resolver: Resolvers::CurrentAdminResolver
    field :admin_user_connection, resolver: Resolvers::AdminUserConnectionResolver
  end
end
