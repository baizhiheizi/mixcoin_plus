# frozen_string_literal: true

module Types
  class AppletPandoLeafTriggerType < Types::AppletTriggerType
    field :params, Types::AppletPandoLeafTriggerParamsType, null: false
    field :asset, Types::MixinAssetType, null: true
  end
end
