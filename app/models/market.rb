# frozen_string_literal: true

# == Schema Information
#
# Table name: markets
#
#  id                            :uuid             not null, primary key
#  booking_order_activity_enable :boolean          default(FALSE)
#  hidden_at                     :datetime
#  ocean_orders_count            :integer          default(0)
#  rank                          :integer
#  recommended_at                :datetime
#  trades_count                  :integer          default(0)
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  base_asset_id                 :uuid
#  quote_asset_id                :uuid
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

  include Markets::Arbitragable

  acts_as_list column: :rank

  # Ocean ONE accepts all assets in Mixin Network as base currencies,
  # and the only supported quote currencies are
  # Mixin XIN (c94ac88f-4671-3976-b60a-09064f1811e8),
  # Bitcoin BTC (c6d0c728-2624-429b-8e0d-d9d19b6592fa),
  # Omni USDT (815b0b1a-2764-3736-8faa-42d694fa620a),
  # pUSD (31d2ea9c-95eb-3355-b65b-ba096853bc18) and
  # Erc20 USDT (4d8c508b-91c5-375b-92b0-ee702ed2dac5).
  validates :quote_asset_id, inclusion: { in: AVAILABLE_QUOTES }
  validate :ensure_quote_and_base_not_the_same

  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  has_many :ocean_orders, dependent: :restrict_with_exception
  has_many :snapshots, through: :ocean_orders, source: :snapshots
  has_many :trades, dependent: :restrict_with_exception
  has_many :arbitrage_orders, dependent: :restrict_with_exception
  has_many :booking_order_snapshots, dependent: :restrict_with_exception
  has_many :booking_order_activities, dependent: :restrict_with_exception
  has_many :prices, class_name: 'MarketPrice', dependent: :restrict_with_exception

  default_scope { includes(:base_asset, :quote_asset) }

  scope :booking_order_activity_enabled, -> { where(booking_order_activity_enable: true) }
  scope :without_hidden, -> { where(hidden_at: nil) }
  scope :order_by_default, lambda {
    where.not(base_asset_id: [OMNI_USDT_ASSET_ID, PUSD_ASSET_ID, ERC20_USDT_ASSET_ID])
         .order('recommended_at DESC NULLS LAST', rank: :asc, trades_count: :desc, ocean_orders_count: :desc, created_at: :desc)
  }
  scope :hot, lambda {
    without_hidden
      .joins(:trades)
      .group(:id)
      .where(trades: { created_at: (7.days.ago)... })
      .where.not(quote_asset_id: Market::OMNI_USDT_ASSET_ID)
      .order('trades.count desc, markets.trades_count desc')
      .first(10)
  }
  scope :recommended, -> { without_hidden.where.not(recommended_at: nil).order(recommended_at: :desc) }
  scope :within_24h, -> { where(created_at: (24.hours.ago)...) }
  scope :order_by_trades_24h, lambda {
    joins(:trades)
      .group(:id)
      .where(trades: { traded_at: 24.hours.ago })
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
    @price_current ||= Rails.cache.read "price_current_#{id}"

    if @price_current.blank?
      @price_current = trades.order(traded_at: :desc).first&.price
      Rails.cache.write "price_current_#{id}", @price_current, ex: 1.minute
    end

    @price_current
  end

  def price_24h_ago
    @price_24h_ago = trades.order(traded_at: :desc).find_by(traded_at: ...(24.hours.ago))&.price
  end

  def change_24h
    @change_24h ||= Rails.cache.read "change_24h_#{id}"

    if @change_24h.blank?
      return if price_current.blank? || price_24h_ago.blank?

      @change_24h = format('%.4f', ((price_current.to_f - price_24h_ago.to_f) / price_24h_ago.to_f))
      Rails.cache.write "change_24h_#{id}", @change_24h, ex: 1.minute
    end

    @change_24h
  end

  def vol_24h
    @vol_24h ||= Rails.cache.read "vol_24h_#{id}"

    if @vol_24h.blank?
      @vol_24h = format('%.6f', trades.where(traded_at: (24.hours.ago)...).sum(:amount))
      Rails.cache.write "vol_24h_#{id}", @vol_24h, ex: 1.minute
    end

    @vol_24h
  end

  def del_price_cache
    Rails.cache.delete "price_current_#{id}"
    Rails.cache.delete "change_24h_#{id}"
    Rails.cache.delete "vol_24h_#{id}"
  end

  def high_price_24h
    trades.where(traded_at: (24.hours.ago)...).maximum(:price)
  end

  def low_price_24h
    trades.where(traded_at: (24.hours.ago)...).minimum(:price)
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
    Rails.cache.read "sync_trades_frequency_lock_#{id}"
  end

  def sync_trades_frequency_lock!
    Rails.cache.write "sync_trades_frequency_lock_#{id}", true, ex: 60
  end

  def sync_trades_frequency_unlock!
    Rails.cache.delete "sync_trades_frequency_lock_#{id}"
  end

  def generate_booking_order_snapshots
    ocean_orders.booking.map(&:generate_booking_snapshot)
  end

  def generate_booking_activity(
    bonus_asset_id: BTC_ASSET_ID,
    started_at: DateTime.yesterday.beginning_of_day.utc,
    ended_at: DateTime.yesterday.end_of_day.utc,
    bonus_total: BookingOrderActivity::BONUS_TOTAL_DEFAULT
  )
    booking_order_activities.create_with(
      bonus_asset_id: bonus_asset_id,
      bonus_total: bonus_total
    ).find_or_create_by(
      started_at: started_at,
      ended_at: ended_at
    )
  end

  def hide!
    update! hidden_at: Time.current
  end

  def unhide!
    update! hidden_at: nil
  end

  def toggle_booking_order_activity_enable!
    update! booking_order_activity_enable: !booking_order_activity_enable
  end

  def reference_price
    _reference_price = (_get_reference_price.presence || _set_reference_price).to_f
    if _reference_price < 10
      _reference_price.floor(4)
    else
      _reference_price.floor(2)
    end
  end

  def generate_price_record_async(_time = Time.current)
    MarketGeneratePriceRecordWorker.perform_async id, _time
  end

  def generate_price_record(_time = Time.current)
    time = _time.beginning_of_hour
    last_tade = trades.where(traded_at: ..._time).order(traded_at: :desc).first
    prices.create_with(
      price: last_tade.price
    ).find_or_create_by(
      time: time
    )
  end

  def generate_price_records_in_last_week
    _time = 7.days.ago
    loop do
      break if _time > Time.current

      generate_price_record_async _time
      _time += 1.hour
    end
  end

  private

  def _reference_price_key
    "refrenece_price_#{id}"
  end

  def _get_reference_price
    Rails.cache.read _reference_price_key
  end

  def _set_reference_price
    return if base_asset.price_usd.blank? || quote_asset.price_usd.blank?
    return if base_asset.price_usd.zero? || quote_asset.price_usd.zero?

    _funds = (1 / quote_asset.price_usd).round(8)
    r = Foxswap.api.pre_order(
      pay_asset_id: quote_asset_id,
      fill_asset_id: base_asset_id,
      funds: (1 / quote_asset.price_usd).round(8)
    )
    _amount = r&.[]('data')&.[]('fill_amount')
    _reference_price =
      if _amount.present?
        (_funds / _amount.to_f).round(8)
      else
        (base_asset.price_usd / quote_asset.price_usd).round(8)
      end

    Rails.cache.write _reference_price_key, _reference_price, ex: 30.seconds

    _reference_price
  end

  def ensure_quote_and_base_not_the_same
    errors.add(:base_asset_id, 'cannot be same with quote') if base_asset_id == quote_asset_id
  end
end
