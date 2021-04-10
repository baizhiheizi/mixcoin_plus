# frozen_string_literal: true

module Types
  class AppStatisticType < Types::BaseModelObject
    field :users_count, Integer, null: false
    field :valid_orders_count, Integer, null: false
    field :markets_count, Integer, null: false
    field :match_total_usd, Float, null: false
    field :fee_total_usd, Float, null: false
    field :invitation_commission_total_usd, Float, null: false
    field :group_owner_commission_total_usd, Float, null: false
  end
end
