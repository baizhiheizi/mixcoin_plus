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
  store :raw, accessors: %i[name symbol chain_id icon_url price_btc price_usd change_usd change_btc]

  belongs_to :user
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, optional: true
  has_many :markets, primary_key: :asset_id, foreign_key: :base_asset_id, dependent: :restrict_with_exception, inverse_of: false

  after_initialize :set_defaults, if: :new_record?
  before_update :set_defaults

  after_commit :ensure_mixin_asset_created

  default_scope -> { order(balance_usd: :desc) }

  delegate :chain_asset, to: :asset

  def sync
    return unless _cache_expired?

    r = MixcoinPlusBot.api.asset(asset_id, access_token: user.access_token)&.[]('data')
    return if r.blank?

    update raw: r, balance: r['balance']

    _mark_cache
  rescue MixinBot::UnauthorizedError
    nil
  end

  private

  def set_defaults
    assign_attributes(
      asset_id: raw['asset_id'],
      balance: raw['balance'],
      balance_usd: raw['balance'].to_f * raw['price_usd'].to_f
    )
  end

  def ensure_mixin_asset_created
    return if asset.present?

    MixinAsset.find_or_create_by_asset_id asset_id
  end

  def _mark_cache
    Rails.cache.write _cache_key, true, ex: 30.seconds
  end

  def _cache_expired?
    !Rails.cache.read(_cache_key)
  end

  def _cache_key
    "#{asset_id}@#{user.id}"
  end
end
