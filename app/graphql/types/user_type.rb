# frozen_string_literal: true

module Types
  class UserType < Types::BaseModelObject
    field :id, ID, null: false
    field :name, String, null: false
    field :avatar, String, null: false
    field :mixin_id, String, null: false
    field :mixin_uuid, String, null: false
  end
end
