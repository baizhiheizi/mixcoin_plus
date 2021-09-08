# frozen_string_literal: true

module Mutations
  class UpdateAppletMutation < Mutations::AuthorizedMutation
    input_object_class Types::AppletInputType

    type Boolean

    def resolve(**params)
      applet = current_user.applets.find_by id: params[:id]
      return if applet.blank?
      return if applet.connected?

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

      applet.update!(
        title: params[:title],
        applet_triggers_attributes: applet_triggers_attributes,
        applet_actions_attributes: applet_actions_attributes
      )
    end
  end
end
