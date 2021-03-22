# frozen_string_literal: true

# == Schema Information
#
# Table name: ocean_orders
#
#  id               :bigint           not null, primary key
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
#  quote_asset_id   :uuid
#  trace_id         :uuid
#  user_id          :uuid
#
class OceanOrder < ApplicationRecord
  extend Enumerize
  include AASM

  belongs_to :user, primary_key: :mixin_uuid, inverse_of: :ocean_orders
  belongs_to :broker, class_name: 'MixinNetworkBroker', primary_key: :uuid, inverse_of: :ocean_orders
  belongs_to :base_asset, class_name: 'Currency', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'Currency', primary_key: :asset_id, inverse_of: false
  has_many :snapshots, class_name: 'MixinNetworkSnapshot', foreign_key: :order_id, dependent: :nullify, inverse_of: :ocean_order

  enumerize :side, in: %w[ask bid], scope: true, predicates: true, i18n_scope: ['activerecord.attributes.ocean_order.sides']
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
  validates :payment_trace_id, presence: true

  aasm column: :state do
    state :drafted, initial: true
    state :paid
    state :booking
    state :completed
    state :canceling
    state :refunded

    # user pay for the order
    event :pay do
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

    # user cancel order; broker transfer cancelling memo to ocean engine
    event :cancel do
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
    r = broker.create_transfer_to_ocean(
      memo_for_creating,
      trace_id: trace_id_for_creating,
      asset_id: side.ask? ? base_asset_id : quote_asset_id,
      amount: side.ask? ? remaining_amount : remaining_funds
    )
    raise r['error'].inspect if r['error'].present?

    book! if r['data']['trace_id'] == trace_id_for_creating

    notify_for_created
  end

  # transfer to engine to cancel order,
  # trace_id unique
  def transfer_to_ocean_for_canceling
    r = broker.create_transfer_to_ocean(
      memo_for_canceling,
      trace_id: trace_id_for_cancelling
    )
    raise r['error'].inspect if r['error'].present?

    cancel! if r['data']['trace_id'] == trace_id_for_cancelling
    notify_for_cancelled
  end

  # transfer to user when receive refund from engine
  # trace_id unique along with snapshot trace_id
  def transfer_to_user_for_refunding(memo, refund_asset_id, refund_amount, _trace_id)
    raise 'Wrong asset id!' unless refund_asset_id == (side.ask? ? base_asset_id : quote_asset_id)

    r = broker.create_transfer_to_user(
      memo,
      asset_id: refund_asset_id,
      amount: refund_amount,
      trace_id: _trace_id
    )
    raise r['error'].inspect if r['error'].present?

    refund! if r['data']['trace_id'].present?
    notify_for_refunded refund_asset_id, refund_amount, _trace_id
  end

  # transfer to user when receive matched asset from engine
  # trace_id unique along with snapshot trace_id
  def transfer_to_user_for_matching(memo, match_asset_id, match_amount, _trace_id)
    raise 'Wrong asset id!' unless match_asset_id == (side.ask? ? quote_asset_id : base_asset_id)

    r = broker.create_transfer_to_user(
      memo,
      asset_id: match_asset_id,
      amount: match_amount,
      trace_id: _trace_id
    )
    raise r['error'].inspect if r['error'].present?

    match! if r['data']['trace_id'].present?
    notify_for_matched match_asset_id, match_amount, _trace_id
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
    OceanOrderStateChangedNotification.with(order: self).deliver(user)
  end

  def ocean_trace_id
    @ocean_trace_id = MixcoinPlusBot.api.unique_uuid trace_id, broker_id
  end

  def pay_url
    format(
      'mixin://pay?recipient=%<recipient>s&asset=%<asset>&amount=%<amount>s&%memo=%<memo>s%trace=%<trace>s',
      recipient: broker_id,
      asset: side.ask? ? quote_asset_id : base_asset_id,
      amount: format('%.8f', side.ask? ? amount : funds),
      memo: 'OCEAN|CREATE',
      trace: trace_id
    )
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      trace_id: SecureRandom.uuid
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
    ocean_trace_id
  end

  # trace id used for canceling order transfer to engine
  # unique along with each broker
  def trace_id_for_cancelling
    broker.mixin_api.unique_conversation_id trace_id, broker_id
  end
end
