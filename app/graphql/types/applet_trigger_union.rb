# frozen_string_literal: true

module Types
  class AppletTriggerUnion < BaseUnion
    possible_types Types::AppletDatetimeTriggerType, Types::Applet4swapTriggerType, Types::AppletPandoLeafTriggerType

    def self.resolve_type(object, _context)
      case object
      when AppletDatetimeTrigger
        Types::AppletDatetimeTriggerType
      when Applet4swapTrigger
        Types::Applet4swapTriggerType
      when AppletPandoLeafTrigger
        Types::AppletPandoLeafTriggerType
      end
    end
  end
end
