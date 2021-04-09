# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :current_admin, resolver: Resolvers::CurrentAdminResolver
    field :admin_user, resolver: Resolvers::AdminUserResolver
    field :admin_user_connection, resolver: Resolvers::AdminUserConnectionResolver
    field :admin_mixin_message_connection, resolver: Resolvers::AdminMixinMessageConnectionResolver
    field :admin_mixin_network_snapshot_connection, resolver: Resolvers::AdminMixinNetworkSnapshotConnectionResolver
    field :admin_ocean_order, resolver: Resolvers::AdminOceanOrderResolver
    field :admin_ocean_order_connection, resolver: Resolvers::AdminOceanOrderConnectionResolver
    field :admin_market_connection, resolver: Resolvers::AdminMarketConnectionResolver
    field :admin_wallet_balance, resolver: Resolvers::AdminWalletBalanceResolver
    field :admin_mixin_conversation_connection, resolver: Resolvers::AdminMixinConversationConnectionResolver
    field :admin_mixin_conversation, resolver: Resolvers::AdminMixinConversationResolver

    field :market, resolver: Resolvers::MarketResolver
    field :market_connection, resolver: Resolvers::MarketConnectionResolver
    field :ocean_order_connection, resolver: Resolvers::OceanOrderConnectionResolver
    field :user_assets, resolver: Resolvers::UserAssetsResolver
    field :user_snapshots, resolver: Resolvers::UserSnapshotsResolver

    field :deprecated_ocean_orders, resolver: Resolvers::DeprecatedOceanOrdersResolver
  end
end
