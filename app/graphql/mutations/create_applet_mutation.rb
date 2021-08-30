# frozen_string_literal: true

module Mutations
  class CreateAppletMutation < Mutations::AuthorizedMutation
    input_object_class Types::AppletInputType

    type Boolean

    def resolve(**params)
      return unless current_user.may_create_applet?

      applet = current_user.applets.new(title: params[:title])
      if params[:applet_datetime_trigger].present?
        applet.applet_triggers.new(
          {
            type: 'AppletDatetimeTrigger'
          }.merge(params[:applet_datetime_trigger])
        )
      end
      if params[:applet_4swap_trigger].present?
        applet.applet_triggers.new(
          {
            type: 'Applet4swapTrigger'
          }.merge(params[:applet_4swap_trigger])
        )
      end
      if params[:applet_4swap_action].present?
        applet.applet_actions.new(
          {
            type: 'Applet4swapAction'
          }.merge(params[:applet_4swap_action])
        )
      end

      applet.save!
    end
  end
end
