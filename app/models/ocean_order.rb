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
#  market_id        :uuid             not null
#  quote_asset_id   :uuid
#  trace_id         :uuid
#  user_id          :uuid
#
# Indexes
#
#  index_ocean_orders_on_market_id  (market_id)
#
class OceanOrder < ApplicationRecord
  MAKER_FEE_RATIO = 0.001
  TAKER_FEE_RATIO = 0.0
  INVITATION_COMMISSION_RATIO = 0.5
  GROUP_OWNER_COMMISSION_RATIO = 0.5

  extend Enumerize
  include AASM

  belongs_to :market, counter_cache: true
  belongs_to :user, inverse_of: :ocean_orders
  belongs_to :broker, class_name: 'OceanBroker', primary_key: :mixin_uuid, inverse_of: :ocean_orders
  belongs_to :base_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :quote_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :conversation, class_name: 'MixinConversation', primary_key: :conversation_id, optional: true

  has_many :snapshots, class_name: 'OceanSnapshot', as: :source, dependent: :restrict_with_exception

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
  validate :ensure_broker_ready

  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }

  aasm column: :state do
    state :drafted, initial: true
    state :paid
    state :booking
    state :completed
    state :canceling
    state :refunded

    # user pay for the order
    event :pay, after: %i[transfer_to_ocean_for_creating notify_for_order_state] do
      transitions from: :drafted, to: :paid
    end

    # broker transfer booking memo to ocean engine
    event :book, after: :notify_for_order_state do
      transitions from: :paid, to: :booking
    end

    # ocean engine complete the order
    # exchanged asset transfered to user
    event :complete, guards: :all_filled?, after: :notify_for_order_state do
      transitions from: :booking, to: :completed
    end

    # user cancel order; broker transfer canceling memo to ocean engine
    event :cancel, after: %i[transfer_to_ocean_for_canceling notify_for_order_state] do
      transitions from: :paid, to: :canceling
      transitions from: :booking, to: :canceling
    end

    # ocean engine refund to broker & broker refund to user
    event :refund, after: :notify_for_order_state do
      transitions from: :canceling, to: :refunded
      transitions from: :booking, to: :refunded
    end
  end

  scope :without_drafted, -> { where.not(state: :drafted) }

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

    if booking? && all_filled?
      complete!
    else
      notify_for_order_state
    end
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

  def ocean_market_id
    format('%<base>s-%<quote>s', base: base_asset_id, quote: quote_asset_id)
  end

  def state_text
    aasm.human_state
  end

  def notify_for_order_state
    return if drafted?

    OceanOrderStateNotification.with(ocean_order: self).deliver(user)
  end

  def payment_amount
    @payment_amount = format('%.8f', side.ask? ? amount : funds)
  end

  def payment_asset_id
    @payment_asset_id = side.ask? ? base_asset_id : quote_asset_id
  end

  def payment_asset
    @payment_asset = MixinAsset.find_by asset_id: payment_asset_id
  end

  def payment_memo
    @payment_memo = Base64.strict_encode64("OCEAN|CREATE|#{side.upcase}|#{order_type.upcase}|#{side.ask? ? quote_asset_id : base_asset_id}|#{price.to_f.round(8)}")
  end

  # OCEAN|Action|Side|Type|AssetId|Price
  def pay_url
    format(
      'mixin://pay?recipient=%<recipient>s&asset=%<asset>s&amount=%<amount>s&memo=%<memo>s&trace=%<trace>s',
      recipient: broker_id,
      asset: payment_asset_id,
      amount: payment_amount,
      memo: payment_memo,
      trace: id
    )
  end

  def invitation_commission_ratio
    if group_owner_commission_ratio.zero? && user.invitor.present?
      INVITATION_COMMISSION_RATIO
    else
      0
    end
  end

  def group_owner_commission_ratio
    if conversation&.group? && conversation&.creator_id != user.mixin_uuid
      GROUP_OWNER_COMMISSION_RATIO
    else
      0
    end
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      broker_id: user.ocean_broker.mixin_uuid,
      trace_id: SecureRandom.uuid,
      base_asset_id: market.base_asset_id,
      quote_asset_id: market.quote_asset_id,
      filled_amount: 0.0,
      filled_funds: 0.0,
      maker_fee: MAKER_FEE_RATIO,
      taker_fee: TAKER_FEE_RATIO
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

  def ensure_broker_ready
    errors.add(:broker_id, 'not ready for exchange') unless broker.ready?
  end
end
