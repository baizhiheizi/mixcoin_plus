# frozen_string_literal: true

module Types
  class UserType < Types::BaseModelObject
    field :id, ID, null: false
    field :name, String, null: false
    field :avatar, String, null: false
    field :mixin_id, String, null: false
    field :mixin_uuid, String, null: false
    field :invite_code, String, null: false
    field :invitations_count, Int, null: false
    field :ocean_orders_count, Int, null: false
    field :may_invited, Boolean, null: false
    field :fennec, Boolean, null: true
    field :last_active_at, GraphQL::Types::ISO8601DateTime, null: true

    field :ifttb_broker, MixinNetworkUserType, null: true
    field :ifttb_broker_id, String, null: true
    field :ifttb_role, String, null: false
    field :may_create_applet, Boolean, null: false
    field :ifttb_pro_expired_at, GraphQL::Types::ISO8601DateTime, null: true
    field :ifttb_stats, GraphQL::Types::JSON, null: false

    field :invitor, Types::UserType, null: true
    field :broker, MixinNetworkUserType, null: true

    def may_invited
      object.may_invited?
    end

    def fennec
      object&.fennec?
    end

    def ifttb_broker_id
      object.ifttb_broker&.ready? && object.ifttb_broker&.mixin_uuid
    end

    def may_create_applet
      object&.may_create_applet?
    end

    def ifttb_stats
      object.ifttb_stats.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
    end
  end
end
