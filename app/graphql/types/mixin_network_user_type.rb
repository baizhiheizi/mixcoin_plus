# frozen_string_literal: true

module Types
  class MixinNetworkUserType < Types::BaseModelObject
    field :id, ID, null: false
    field :mixin_uuid, String, null: false
    field :name, String, null: false
    field :state, String, null: false
    field :type, String, null: false

    field :has_pin, Boolean, null: false

    field :owner, Types::UserType, null: true

    def owner
      BatchLoader::GraphQL.for(object.owner_id).batch do |owner_ids, loader|
        User.where(id: owner_ids).each { |owner| loader.call(owner.id, owner) }
      end
    end

    def has_pin
      object.pin.present?
    end
  end
end
