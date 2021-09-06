# frozen_string_literal: true

module Mutations
  class UpdateAppletMutation < Mutations::AuthorizedMutation
    input_object_class Types::AppletInputType

    type Boolean

    def resolve(**params)
      applet = current_user.applets.find_by id: params[:id]
      return unless applet&.disconnect?

      applet_triggers_attributes = []
      applet_actions_attributes = []
      applet.title = params[:title]

      applet_triggers_attributes.push(params[:applet_datetime_trigger]) if params[:applet_datetime_trigger].present?
      applet_triggers_attributes.push(params[:applet_4swap_trigger]) if params[:applet_4swap_trigger].present?
      applet_actions_attributes.push(params[:applet_4swap_action]) if params[:applet_4swap_action].present?
      applet_actions_attributes.push(params[:applet_mix_swap_action]) if params[:applet_mix_swap_action].present?

      applet.update!(
        title: params[:title],
        applet_triggers_attributes: applet_triggers_attributes,
        applet_actions_attributes: applet_actions_attributes
      )
    end
  end
end
