# frozen_string_literal: true

module Types
  class AppletActionUnion < BaseUnion
    possible_types Types::Applet4swapActionType

    def self.resolve_type(object, _context)
      Types::Applet4swapActionType if object.is_a?(Applet4swapAction)
      Types::AppletMixSwapActionType if object.is_a?(AppletMixSwapAction)
    end
  end
end
