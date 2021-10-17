# frozen_string_literal: true

module Types
  class AppletExinLocalTriggerType < Types::AppletTriggerType
    field :params, Types::AppletExinLocalTriggerParamsType, null: false
    field :asset, Types::MixinAssetType, null: true
  end
end
