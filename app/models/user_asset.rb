# frozen_string_literal: true

# == Schema Information
#
# Table name: user_assets
#
#  id          :uuid             not null, primary key
#  balance     :decimal(, )      default(0.0)
#  balance_usd :decimal(, )      default(0.0)
#  raw         :json             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  asset_id    :uuid             not null
#  user_id     :uuid             not null
#
# Indexes
#
#  index_user_assets_on_asset_id  (asset_id)
#  index_user_assets_on_user_id   (user_id)
#
class UserAsset < ApplicationRecord
  store :raw, accessors: %i[name symbol chain_id icon_url price_btc price_usd]

  belongs_to :user
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, optional: true
  has_many :ocean_markets, primary_key: :asset_id, foreign_key: :base_asset_id, dependent: :restrict_with_exception, inverse_of: false

  before_validation :set_defaults, on: :create

  after_commit :ensure_mixin_asset_created

  default_scope -> { order(balance_usd: :desc) }

  private

  def set_defaults
    assign_attributes(
      balance: raw['balance'],
      balance_usd: raw['balance'].to_f * raw['price_usd'].to_f
    )
  end

  def ensure_mixin_asset_created
    return if asset.present?

    MixinAsset.find_or_create_by_asset_id asset_id
  end
end
