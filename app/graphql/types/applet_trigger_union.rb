# frozen_string_literal: true

module Types
  class AppletTriggerUnion < BaseUnion
    possible_types Types::AppletDatetimeTriggerType, Types::AppletTargetPriceTriggerType

    def self.resolve_type(object, _context)
      case object
      when AppletDatetimeTrigger
        Types::AppletDatetimeTriggerType
      when AppletTargetPriceTrigger
        Types::AppletTargetPriceTriggerType
      end
    end
  end
end
