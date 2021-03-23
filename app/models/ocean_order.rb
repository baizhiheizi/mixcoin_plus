# frozen_string_literal: true

# == Schema Information
#
# Table name: ocean_orders
#
#  id               :uuid             not null, primary key
#  filled_amount    :decimal(, )
#  filled_funds     :decimal(, )
#  maker_fee        :float            default(0.0)
#  order_type       :string
#  price            :decimal(, )
#  remaining_amount :decimal(, )
#  remaining_funds  :decimal(, )
#  side             :string
#  state            :string
#  taker_fee        :float            default(0.0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  base_asset_id    :uuid
#  broker_id        :uuid
#  conversation_id  :uuid
#  ocean_market_id  :uuid             not null
#  quote_asset_id   :uuid
#  trace_id         :uuid
#  user_id          :uuid
#
# Indexes
#
#  index_ocean_orders_on_ocean_market_id  (ocean_market_id)
#
class OceanOrder < ApplicationRecord
  extend Enumerize
  include AASM

  belongs_to :ocean_market
  belongs_to :user, inverse_of: :ocean_orders
  belongs_to :broker, class_name: 'OceanBroker', primary_key: :mixin_uuid, inverse_of: :ocean_orders
  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  has_many :snapshots, class_name: 'OceanSnapshot', as: :source, dependent: :restrict_with_exception

  enumerize :side, in: %w[ask bid], scope: true, predicates: true
  enumerize :order_type, in: %w[limit market], scope: true, predicates: true

  before_validation :set_defaults, on: :create

  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0.000_000_01 }, if: -> { order_type.limit? }
  validates :remaining_amount, presence: true, numericality: { greater_than_or_equal_to: 0.0 }
  validates :remaining_funds, presence: true, numericality: { greater_than_or_equal_to: 0.0 }
  validates :filled_amount, presence: true, numericality: { greater_than_or_equal_to: 0.0 }
  validates :filled_funds, presence: true, numericality: { greater_than_or_equal_to: 0.0 }
  validates :base_asset_id, presence: true
  validates :quote_asset_id, presence: true
  validates :trace_id, presence: true

  aasm column: :state do
    state :drafted, initial: true
    state :paid
    state :booking
    state :completed
    state :canceling
    state :refunded

    # user pay for the order
    event :pay, after: :transfer_to_ocean_for_creating do
      transitions from: :drafted, to: :paid
    end

    # broker transfer booking memo to ocean engine
    event :book do
      transitions from: :paid, to: :booking
    end

    # ocean engine complete the order
    # exchanged asset transfered to user
    event :complete, guards: :all_filled? do
      transitions from: :booking, to: :completed
    end

    # user cancel order; broker transfer canceling memo to ocean engine
    event :cancel, after: :transfer_to_ocean_for_canceling do
      transitions from: :paid, to: :canceling
      transitions from: :booking, to: :canceling
    end

    # ocean engine refund to broker & broker refund to user
    event :refund do
      transitions from: :canceling, to: :refunded
      transitions from: :booking, to: :refunded
    end
  end

  def amount
    remaining_amount.to_f + filled_amount.to_f
  end

  def funds
    remaining_funds.to_f + filled_funds.to_f
  end

  # when all amount matched, order complete.
  def all_filled?
    remaining_amount.zero? && remaining_funds.zero?
  end

  def match!
    sync_with_engine

    complete! if booking? && all_filled?
  end

  def sync_with_engine
    r = Ocean.api.order broker.ocean_access_token, trace_id
    raise r.to_s if r['data'].blank?

    update(
      filled_amount: r['data']['filled_amount'].to_f,
      filled_funds: r['data']['filled_funds'].to_f,
      remaining_amount: r['data']['remaining_amount'].to_f,
      remaining_funds: r['data']['remaining_funds'].to_f
    )
  end

  # transfer to engine for creating order,
  # trace_id unique.
  def transfer_to_ocean_for_creating
    MixinTransfer.create_with(
      source: self,
      user_id: broker.mixin_uuid,
      transfer_type: :ocean_order_create,
      opponent_id: OceanBroker::OCEAN_ENGINE_USER_ID,
      asset_id: side.ask? ? base_asset_id : quote_asset_id,
      amount: side.ask? ? remaining_amount : remaining_funds,
      memo: memo_for_creating
    ).find_or_create_by!(
      trace_id: trace_id_for_creating
    )
  end

  # transfer to engine to cancel order,
  # trace_id unique
  def transfer_to_ocean_for_canceling
    MixinTransfer.create_with(
      source: self,
      user_id: broker.mixin_uuid,
      transfer_type: :ocean_order_cancel,
      opponent_id: OceanBroker::OCEAN_ENGINE_USER_ID,
      asset_id: OceanBroker::EXCHANGE_ASSET_ID,
      amount: OceanBroker::EXCHANGE_ASSET_AMOUNT,
      memo: memo_for_canceling
    ).find_or_create_by!(
      trace_id: trace_id_for_canceling
    )
  end

  # transfer to user when receive refund from engine
  # trace_id unique along with snapshot trace_id
  def transfer_to_user_for_refunding(refund_asset_id, refund_amount, _trace_id)
    raise 'Wrong asset id!' unless refund_asset_id == (side.ask? ? base_asset_id : quote_asset_id)

    MixinTransfer.create_with(
      source: self,
      wallet: broker,
      transfer_type: :ocean_order_refund,
      opponent_id: user.mixin_uuid,
      asset_id: refund_asset_id,
      amount: refund_amount,
      memo: "CREATE|REFUND|#{trace_id}"
    ).find_or_create_by!(
      trace_id: _trace_id
    )
  end

  # transfer to user when receive matched asset from engine
  # trace_id unique along with snapshot trace_id
  def transfer_to_user_for_matching(match_asset_id, match_amount, _trace_id)
    raise 'Wrong asset id!' unless match_asset_id == (side.ask? ? quote_asset_id : base_asset_id)

    MixinTransfer.create_with(
      source: self,
      wallet: broker,
      transfer_type: :ocean_order_match,
      opponent_id: user.mixin_uuid,
      asset_id: match_asset_id,
      amount: match_amount,
      memo: "CREATE|MATCH|#{trace_id}"
    ).find_or_create_by!(
      trace_id: _trace_id
    )
  end

  def market_id
    format('%<base>s-%<quote>s', base: base_asset_id, quote: quote_asset_id)
  end

  def state_text
    aasm.human_state
  end

  def notify_for_created
    notify_for_order_state
  end

  def notify_for_cancelled
    notify_for_order_state
  end

  def notify_for_refunded(_asset_id, _amount, _trace_id)
    currency = Currency.find_by(asset_id: _asset_id)
    NotificationService
      .new
      .app_card(
        user.mixin_uuid,
        icon_url: currency.icon_url,
        title: _amount,
        description: currency.symbol,
        action: "mixin://snapshots?trace=#{_trace_id}"
      )
    notify_for_order_state
  end

  def notify_for_matched(_asset_id, _amount, _trace_id)
    currency = Currency.find_by(asset_id: _asset_id)
    NotificationService
      .new
      .app_card(
        user.mixin_uuid,
        icon_url: currency.icon_url,
        title: _amount,
        description: currency.symbol,
        action: "mixin://snapshots?trace=#{_trace_id}"
      )
    notify_for_order_state
  end

  def notify_for_order_state
    # OceanOrderStateChangedNotification.with(order: self).deliver(user)
  end

  def payment_amount
    format('%.8f', side.ask? ? amount : funds)
  end

  def payment_asset_id
    side.ask? ? base_asset_id : quote_asset_id
  end

  # OCEAN|Action|Side|Type|AssetId|Price
  def pay_url
    format(
      'mixin://pay?recipient=%<recipient>s&asset=%<asset>s&amount=%<amount>s&memo=%<memo>s&trace=%<trace>s',
      recipient: broker_id,
      asset: payment_asset_id,
      amount: payment_amount,
      memo: "OCEAN|CREATE|#{side.upcase}|#{order_type.upcase}|#{side.ask? ? quote_asset_id : base_asset_id}|#{price.to_f.round(8)}",
      trace: id
    )
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      broker_id: user.ocean_broker.mixin_uuid,
      trace_id: SecureRandom.uuid,
      base_asset_id: ocean_market.base_asset_id,
      quote_asset_id: ocean_market.quote_asset_id,
      filled_amount: 0.0,
      filled_funds: 0.0
    )
  end

  # memo in transfer for creating order to engine
  def memo_for_creating
    asset_id = side.ask? ? quote_asset_id : base_asset_id

    Base64.strict_encode64(
      {
        T: order_type.limit? ? 'L' : 'M',
        P: price.to_s,
        S: side.ask? ? 'A' : 'B',
        A: asset_id.split('-').pack('H* H* H* H* H*')
      }.to_msgpack
    )
  end

  # memo in transfer for canceling order to engine
  def memo_for_canceling
    Base64.strict_encode64(
      {
        O: trace_id.split('-').pack('H* H* H* H* H*')
      }.to_msgpack
    )
  end

  # trace id used for creating order transfer to engine
  # same as local order trace id
  def trace_id_for_creating
    trace_id
  end

  # trace id used for canceling order transfer to engine
  # unique along with each broker
  def trace_id_for_canceling
    broker.mixin_api.unique_conversation_id trace_id, broker_id
  end
end
