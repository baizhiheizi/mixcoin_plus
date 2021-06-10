# frozen_string_literal: true

module Types
  class BookingOrderActivityParticipantType < Types::BaseModelObject
    field :id, ID, null: false
    field :bonus, Float, null: true
    field :scores, Float, null: false
    field :scores_ratio, Float, null: false
    field :scores_total, Float, null: false
    field :bonus_asset_id, String, null: true
    field :state, String, null: true

    field :booking_order_activity, Types::BookingOrderActivityType, null: false
    field :bonus_asset, Types::MixinAssetType, null: false
    field :user, Types::UserType, null: false

    def booking_order_activity
      BatchLoader::GraphQL.for(object.booking_order_activity_id).batch do |booking_order_activity_ids, loader|
        BookingOrderActivity.where(id: booking_order_activity_ids).each { |activity| loader.call(activity.id, activity) }
      end
    end

    def bonus_asset
      BatchLoader::GraphQL.for(object.bonus_asset_id).batch do |bonus_asset_ids, loader|
        MixinAsset.where(asset_id: bonus_asset_ids).each { |mixin_asset| loader.call(mixin_asset.asset_id, mixin_asset) }
      end
    end

    def user
      BatchLoader::GraphQL.for(object.user_id).batch do |user_ids, loader|
        User.where(id: user_ids).each { |user| loader.call(user.id, user) }
      end
    end
  end
end
