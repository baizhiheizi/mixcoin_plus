# frozen_string_literal: true

module Mutations
  class CreateAppletMutation < Mutations::AuthorizedMutation
    input_object_class Types::AppletInputType

    type Boolean

    def resolve(**params)
      return unless current_user.may_create_applet?

      applet_actions_attributes =
        params[:applet_actions_attributes]
        .map do |action|
          action.to_hash.deep_transform_keys! { |key| key.to_s.underscore }
        end

      applet_triggers_attributes =
        params[:applet_triggers_attributes]
        .map do |trigger|
          trigger.to_hash.deep_transform_keys! { |key| key.to_s.underscore }
        end

      current_user
        .applets
        .create!(
          title: params[:title],
          applet_actions_attributes: applet_actions_attributes,
          applet_triggers_attributes: applet_triggers_attributes
        )
    end
  end
end
