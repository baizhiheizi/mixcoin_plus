# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :current_admin, resolver: Resolvers::CurrentAdminResolver
    field :admin_user, resolver: Resolvers::AdminUserResolver
    field :admin_user_connection, resolver: Resolvers::AdminUserConnectionResolver
    field :admin_mixin_network_user_connection, resolver: Resolvers::AdminMixinNetworkUserConnectionResolver
    field :admin_mixin_network_user, resolver: Resolvers::AdminMixinNetworkUserResolver
    field :admin_invitation_connection, resolver: Resolvers::AdminInvitationConnectionResolver
    field :admin_mixin_message_connection, resolver: Resolvers::AdminMixinMessageConnectionResolver
    field :admin_mixin_network_snapshot_connection, resolver: Resolvers::AdminMixinNetworkSnapshotConnectionResolver
    field :admin_ocean_order, resolver: Resolvers::AdminOceanOrderResolver
    field :admin_ocean_order_connection, resolver: Resolvers::AdminOceanOrderConnectionResolver
    field :admin_swap_order_connection, resolver: Resolvers::AdminSwapOrderConnectionResolver
    field :admin_swap_order, resolver: Resolvers::AdminSwapOrderResolver
    field :admin_market_connection, resolver: Resolvers::AdminMarketConnectionResolver
    field :admin_market, resolver: Resolvers::AdminMarketResolver
    field :admin_trade_connection, resolver: Resolvers::AdminTradeConnectionResolver
    field :admin_wallet_balance, resolver: Resolvers::AdminWalletBalanceResolver
    field :admin_mixin_conversation_connection, resolver: Resolvers::AdminMixinConversationConnectionResolver
    field :admin_mixin_conversation, resolver: Resolvers::AdminMixinConversationResolver
    field :admin_mixin_transfer_connection, resolver: Resolvers::AdminMixinTransferConnectionResolver
    field :admin_app_statistic, resolver: Resolvers::AdminAppStatisticResolver
    field :admin_user_deprecated_ocean_snapshots, resolver: Resolvers::AdminUserDeprecatedOceanSnapshotsResolver
    field :admin_user_deprecated_ocean_orders, resolver: Resolvers::AdminUserDeprecatedOceanOrdersResolver
    field :admin_arbitrage_order_connection, resolver: Resolvers::AdminArbitrageOrderConnectionResolver
    field :admin_arbitrage_order, resolver: Resolvers::AdminArbitrageOrderResolver
    field :admin_booking_order_snapshot_connection, resolver: Resolvers::AdminBookingOrderSnapshotConnectionResolver
    field :admin_booking_order_activity, resolver: Resolvers::AdminBookingOrderActivityResolver
    field :admin_booking_order_activity_connection, resolver: Resolvers::AdminBookingOrderActivityConnectionResolver
    field :admin_booking_order_activity_participant_connection, resolver: Resolvers::AdminBookingOrderActivityParticipantConnectionResolver

    field :current_conversation, resolver: Resolvers::CurrentConversationResolver
    field :market, resolver: Resolvers::MarketResolver
    field :market_price_chart_data, resolver: Resolvers::MarketPriceChartDataResolver
    field :market_trade_connection, resolver: Resolvers::MarketTradeConnectionResolver
    field :market_connection, resolver: Resolvers::MarketConnectionResolver
    field :mixin_asset_connection, resolver: Resolvers::MixinAssetConnectionResolver
    field :ocean_order_connection, resolver: Resolvers::OceanOrderConnectionResolver
    field :ocean_order, resolver: Resolvers::OceanOrderResolver
    field :ocean_snapshot_connection, resolver: Resolvers::OceanSnapshotConnectionResolver
    field :user_asset, resolver: Resolvers::UserAssetResolver
    field :user_assets, resolver: Resolvers::UserAssetsResolver
    field :user_snapshots, resolver: Resolvers::UserSnapshotsResolver
    field :invitee_connection, resolver: Resolvers::InviteeConnectionResolver
    field :invitation_commission_connection, resolver: Resolvers::InvitationCommissionConnectionResolver
    field :group_owner_commission_connection, resolver: Resolvers::GroupOwnerCommissionConnectionResolver

    field :deprecated_ocean_orders, resolver: Resolvers::DeprecatedOceanOrdersResolver
  end
end
