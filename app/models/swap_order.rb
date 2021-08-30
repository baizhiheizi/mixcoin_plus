# frozen_string_literal: true

# == Schema Information
#
# Table name: swap_orders
#
#  id                 :uuid             not null, primary key
#  fill_amount        :decimal(, )
#  min_amount         :decimal(, )
#  pay_amount         :decimal(, )
#  raw                :json
#  state              :string
#  type               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  applet_activity_id :uuid
#  arbitrage_order_id :uuid
#  broker_id          :uuid
#  fill_asset_id      :uuid
#  pay_asset_id       :uuid
#  trace_id           :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_swap_orders_on_applet_activity_id  (applet_activity_id)
#  index_swap_orders_on_arbitrage_order_id  (arbitrage_order_id)
#  index_swap_orders_on_broker_id           (broker_id)
#  index_swap_orders_on_fill_asset_id       (fill_asset_id)
#  index_swap_orders_on_pay_asset_id        (pay_asset_id)
#  index_swap_orders_on_trace_id            (trace_id)
#  index_swap_orders_on_user_id             (user_id)
#
class SwapOrder < ApplicationRecord
  FSWAP_MTG_MEMBERS = Rails.application.credentials.dig(:foxswap, :mtg_members)
  FSWAP_MTG_THRESHOLD = Rails.application.credentials.dig(:foxswap, :mtg_threshold)
  FSWAP_MTG_PUBLIC_KEY = Rails.application.credentials.dig(:foxswap, :mtg_public_key)

  include AASM

  belongs_to :user, optional: true
  belongs_to :arbitrage_order, optional: true
  belongs_to :applet_activity, optional: true
  belongs_to :broker, class_name: 'MixinNetworkUser', primary_key: :mixin_uuid, inverse_of: :swap_orders
  belongs_to :pay_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :fill_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false

  has_many :snapshots, class_name: 'SwapSnapshot', as: :source, dependent: :restrict_with_exception
  has_many :transfers, class_name: 'MixinTransfer', as: :source, dependent: :restrict_with_exception

  before_validation :set_defaults, on: :create

  validates :trace_id, presence: true, uniqueness: true
  validate :pay_and_fill_asset_not_the_same

  scope :without_drafted, -> { where.not(state: :drafted) }
  scope :without_finished, -> { where.not(state: %i[rejected traded]) }

  aasm column: :state do
    state :drafted, initial: true
    state :paid
    state :swapping
    state :rejected
    state :traded

    event :pay, after: :create_swap_transfer! do
      transitions from: :drafted, to: :paid
    end

    event :swap do
      transitions from: :paid, to: :swapping
    end

    event :trade, after: :after_trade do
      transitions from: :swapping, to: :traded
    end

    event :reject do
      transitions from: :swapping, to: :rejected
    end
  end

  def create_swap_transfer!
    transfers.create_with(
      wallet: broker,
      transfer_type: :swap_order_create,
      priority: :critical,
      opponent_multisig: {
        receivers: FSWAP_MTG_MEMBERS,
        threshold: FSWAP_MTG_THRESHOLD
      },
      asset_id: pay_asset_id,
      amount: pay_amount.to_f,
      memo: fswap_mtg_memo
    ).find_or_create_by!(
      trace_id: trace_id
    )
  end

  def fswap_mtg_memo
    r = Foxswap.api.actions(
      user_id: receiver_id,
      follow_id: trace_id,
      asset_id: fill_asset_id,
      minimum_fill: min_amount.present? ? format('%.8f', min_amount) : nil
    )

    r['data']['action']
  end

  def sync_order
    r = foxswap_order_detail
    return if r['data'].blank?

    update(
      fill_amount: r['data']['fill_amount'],
      raw: r['data']
    )
  end

  def after_trade
    sync_order
  end

  def foxswap_order_detail
    @foxswap_order_detail ||= Foxswap.api.order(trace_id, authorization: broker.mixin_api.access_token('GET', '/me'))
  end

  def refresh_state!
    r = foxswap_order_detail
    return if r['data'].blank?

    trade! if r['data']['state'] == 'Done' && may_trade?
    reject! if r['data']['state'] == 'Rejected' && may_reject?
  end

  def receiver_id
    broker.mixin_uuid
  end

  # SWAP|Action|Fill Asset ID|Min Amount
  def pay_url
    format(
      'mixin://pay?recipient=%<recipient>s&asset=%<asset>s&amount=%<amount>s&memo=%<memo>s&trace=%<trace>s',
      recipient: broker_id,
      asset: pay_asset_id,
      amount: pay_amount,
      memo: Base64.strict_encode64("SWAP|CREATE|#{fill_asset_id}|#{min_amount.to_f.round(8)}"),
      trace: id
    )
  end

  private

  def set_defaults
    return unless new_record?

    self.trace_id = SecureRandom.uuid if trace_id.blank?
  end

  def pay_and_fill_asset_not_the_same
    errors.add(:fill_asset, ' is the same with pay asset') unless pay_asset_id != fill_asset_id
  end
end
