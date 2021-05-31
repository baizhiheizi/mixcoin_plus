# frozen_string_literal: true

# == Schema Information
#
# Table name: markets
#
#  id                 :uuid             not null, primary key
#  hidden_at          :datetime
#  ocean_orders_count :integer          default(0)
#  rank               :integer
#  recommended_at     :datetime
#  trades_count       :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  base_asset_id      :uuid
#  quote_asset_id     :uuid
#
# Indexes
#
#  index_markets_on_base_asset_id   (base_asset_id)
#  index_markets_on_quote_asset_id  (quote_asset_id)
#
class Market < ApplicationRecord
  XIN_ASSET_ID = 'c94ac88f-4671-3976-b60a-09064f1811e8'
  BTC_ASSET_ID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'
  OMNI_USDT_ASSET_ID = '815b0b1a-2764-3736-8faa-42d694fa620a'
  ERC20_USDT_ASSET_ID = '4d8c508b-91c5-375b-92b0-ee702ed2dac5'
  PUSD_ASSET_ID = '31d2ea9c-95eb-3355-b65b-ba096853bc18'
  AVAILABLE_QUOTES = [ERC20_USDT_ASSET_ID, PUSD_ASSET_ID, XIN_ASSET_ID, BTC_ASSET_ID, OMNI_USDT_ASSET_ID].freeze

  include RankedModel
  include Markets::Arbitragable

  ranks :rank, with_same: :quote_asset_id

  # Ocean ONE accepts all assets in Mixin Network as base currencies,
  # and the only supported quote currencies are
  # Mixin XIN (c94ac88f-4671-3976-b60a-09064f1811e8),
  # Bitcoin BTC (c6d0c728-2624-429b-8e0d-d9d19b6592fa) and
  # Omni USDT (815b0b1a-2764-3736-8faa-42d694fa620a).
  # pUSD (31d2ea9c-95eb-3355-b65b-ba096853bc18).
  # Erc20 USDT (4d8c508b-91c5-375b-92b0-ee702ed2dac5).
  validates :quote_asset_id, presence: true, inclusion: { in: AVAILABLE_QUOTES }
  validates :base_asset_id, presence: true
  validate :ensure_quote_and_base_not_the_same

  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :snapshots, through: :ocean_orders, source: :snapshots
  has_many :trades, dependent: :restrict_with_exception
  has_many :arbitrage_orders, dependent: :restrict_with_exception

  scope :without_hidden, -> { where.not(hidden_at: nil) }
  scope :order_by_default, lambda {
    where.not(base_asset_id: [OMNI_USDT_ASSET_ID, PUSD_ASSET_ID, ERC20_USDT_ASSET_ID])
         .order('recommended_at DESC NULLS LAST', rank: :asc, trades_count: :desc, ocean_orders_count: :desc, created_at: :desc)
  }
  scope :recommended, -> { where.not(recommended_at: nil).order(recommended_at: :desc) }
  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }
  scope :order_by_trades_24h, lambda {
    joins(:trades)
      .group(:id)
      .where(trades: { traded_at: (Time.current - 24.hours) })
      .select(
        <<~SQL.squish
          markets.*,
          SUM(trades.amount) as vol_24h
        SQL
      ).order(vol_24h: :desc)
  }

  def recommended?
    recommended_at?
  end

  def recommend!
    update! recommended_at: Time.current
  end

  def unrecommend!
    update recommended_at: nil
  end

  def ocean_market_id
    format('%<base>s-%<quote>s', base: base_asset_id, quote: quote_asset_id)
  end

  def price_current
    @price_current ||= Global.redis.get "price_current_#{id}"

    if @price_current.blank?
      @price_current = trades.order(traded_at: :desc).first&.price
      Global.redis.set "price_current_#{id}", @price_current, ex: 1.minute
    end

    @price_current
  end

  def price_24h_ago
    @price_24h_ago = trades.order(traded_at: :desc).find_by(traded_at: ...(Time.current - 24.hours))&.price
  end

  def change_24h
    @change_24h ||= Global.redis.get "change_24h_#{id}"

    if @change_24h.blank?
      return if price_current.blank? || price_24h_ago.blank?

      @change_24h = format('%.4f', ((price_current.to_f - price_24h_ago.to_f) / price_24h_ago.to_f))
      Global.redis.set "change_24h_#{id}", @change_24h, ex: 1.minute
    end

    @change_24h
  end

  def vol_24h
    @vol_24h ||= Global.redis.get "vol_24h_#{id}"

    if @vol_24h.blank?
      @vol_24h = format('%.6f', trades.where(traded_at: (Time.current - 24.hours)...).sum(:amount))
      Global.redis.set "vol_24h_#{id}", @vol_24h, ex: 1.minute
    end

    @vol_24h
  end

  def del_price_cache
    Global.redis.del "price_current_#{id}"
    Global.redis.del "change_24h_#{id}"
    Global.redis.del "vol_24h_#{id}"
  end

  def high_price_24h
    trades.where(traded_at: (Time.current - 24.hours)...).maximum(:price)
  end

  def low_price_24h
    trades.where(traded_at: (Time.current - 24.hours)...).minimum(:price)
  end

  def sync_trades_from_engine
    offset = trades.order(traded_at: :asc).last&.raw&.[]('created_at')
    r = Ocean.api.trades(ocean_market_id, limit: 100, offset: offset)

    raise r.inspect if r['data'].nil?

    r['data'].each do |trade|
      trades.create_with(
        raw: trade
      ).find_or_create_by!(
        trade_id: trade['trade_id']
      )
    end

    sync_trades_from_engine_async if r['data'].count == 100
  end

  def sync_trades_from_engine_async
    MarketSyncTradesFromEngineWorker.perform_async id
  end

  def sync_trades_frequency_locked?
    Global.redis.get "sync_trades_frequency_lock_#{id}"
  end

  def sync_trades_frequency_lock!
    Global.redis.set "sync_trades_frequency_lock_#{id}", true, ex: 60
  end

  def sync_trades_frequency_unlock!
    Global.redis.del "sync_trades_frequency_lock_#{id}"
  end

  private

  def ensure_quote_and_base_not_the_same
    errors.add(:base_asset_id, 'cannot be same with quote') if base_asset_id == quote_asset_id
  end
end
