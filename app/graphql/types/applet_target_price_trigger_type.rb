# frozen_string_literal: true

module Types
  class AppletDatetimeTriggerType < Types::AppletTriggerType
    field :base_asset_id, String, null: false
    field :quote_asset_id, String, null: false
    field :target_price, Float, null: false
    field :side, String, null: false
    field :compare, String, null: false
  end
end
