# frozen_string_literal: true

module Types
  class AppStatisticType < Types::BaseModelObject
    field :users_count, Integer, null: false
    field :daily_active_users_count, Integer, null: true
    field :weekly_active_users_count, Integer, null: true
    field :monthly_active_users_count, Integer, null: true
    field :valid_orders_count, Integer, null: false
    field :markets_count, Integer, null: false
    field :match_total_usd, Float, null: false
    field :fee_total_usd, Float, null: false
    field :invitation_commission_total_usd, Float, null: false
    field :group_owner_commission_total_usd, Float, null: false
    field :unprocessed_snapshots_count, Integer, null: false
    field :unprocessed_transfers_count, Integer, null: false
  end
end
