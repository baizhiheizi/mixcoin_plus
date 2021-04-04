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
    field :may_invited, Boolean, null: false

    field :invitor, Types::UserType, null: true
    field :ocean_broker, MixinNetworkUserType, null: true

    def may_invited
      object.may_invited?
    end
  end
end
