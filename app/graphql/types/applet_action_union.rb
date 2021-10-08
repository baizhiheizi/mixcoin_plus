# frozen_string_literal: true

module Types
  class AppletActionUnion < BaseUnion
    possible_types Types::Applet4swapActionType, Types::AppletMixSwapActionType, Types::AppletAlertActionType

    def self.resolve_type(object, _context)
      case object
      when Applet4swapAction
        Types::Applet4swapActionType
      when AppletMixSwapAction
        Types::AppletMixSwapActionType
      when AppletAlertAction
        Types::AppletAlertActionType
      end
    end
  end
end
