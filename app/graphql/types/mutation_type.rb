# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # admin
    field :admin_login, mutation: Mutations::AdminLoginMutation
    field :admin_rank_market, mutation: Mutations::AdminRankMarketMutation

    # application
    field :switch_locale, mutation: Mutations::SwitchLocaleMutation
    field :create_ocean_order, mutation: Mutations::CreateOceanOrderMutation
    field :cancel_ocean_order, mutation: Mutations::CancelOceanOrderMutation
    field :favorite_market, mutation: Mutations::FavoriteMarketMutation
    field :unfavorite_market, mutation: Mutations::UnfavoriteMarketMutation
    field :generate_cancel_deprecated_ocean_order_pay_url, mutation: Mutations::GenerateCancelDeprecatedOceanOrderPayUrlMutation
    field :create_invitation, mutation: Mutations::CreateInvitationMutation
  end
end
