# frozen_string_literal: true

module Types
  class AppletPandoRingsTriggerType < Types::AppletTriggerType
    field :params, Types::AppletPandoRingsTriggerParamsType, null: false
    field :asset, Types::MixinAssetType, null: true
  end
end
