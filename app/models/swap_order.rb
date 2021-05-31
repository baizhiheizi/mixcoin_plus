# frozen_string_literal: true

# == Schema Information
#
# Table name: swap_orders
#
#  id                 :bigint           not null, primary key
#  fill_amount        :decimal(, )
#  min_amount         :decimal(, )
#  pay_amount         :decimal(, )
#  raw                :json
#  state              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  arbitrage_order_id :uuid
#  broker_id          :uuid
#  fill_asset_id      :uuid
#  pay_asset_id       :uuid
#  trace_id           :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_swap_orders_on_arbitrage_order_id  (arbitrage_order_id)
#  index_swap_orders_on_broker_id           (broker_id)
#  index_swap_orders_on_fill_asset_id       (fill_asset_id)
#  index_swap_orders_on_pay_asset_id        (pay_asset_id)
#  index_swap_orders_on_trace_id            (trace_id)
#  index_swap_orders_on_user_id             (user_id)
#
class SwapOrder < ApplicationRecord
  FOX_SWAP_APP_ID = 'a753e0eb-3010-4c4a-a7b2-a7bda4063f62'
  FOX_SWAP_BROKER_ID = 'd8d186c4-62a7-320b-b930-11dfc1c76708'

  include AASM

  belongs_to :market
  belongs_to :arbitrage_order, optional: true
  belongs_to :broker, primary_key: :mixin_uuid, inverse_of: :swap_orders
  belongs_to :pay_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :fill_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false

  has_many :snapshots, class_name: 'SwapSnapshot', as: :source, dependent: :restrict_with_exception
  has_many :transfers, class_name: 'MixinTransfer', as: :source, dependent: :restrict_with_exception

  before_validation :set_defaults, on: :create

  validates :trace_id, presence: true, uniqueness: true

  aasm column: :state do
    state :drafted, initial: true
    state :paid
    state :swapping
    state :rejected
    state :traded
    state :refunded

    event :pay, after: :create_swap_transfer! do
      transitions from: :drafted, to: :paid
    end

    event :swap do
      transitions from: :paid, to: :swapping
    end

    event :trade do
      transitions from: :swapping, to: :traded
    end

    event :reject do
      transitions from: :swapping, to: :rejected
    end

    event :refund do
      transitions from: :paid, to: :refunded
      transitions from: :rejected, to: :refunded
    end
  end

  def arbitrage?
    arbitrage_order.present?
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

  def create_swap_transfer!
    transfers.create_with(
      wallet: broker,
      transfer_type: :swap_order_create,
      priority: :critical,
      opponent_id: FOX_SWAP_BROKER_ID,
      asset_id: pay_asset_id,
      amount: pay_amount.to_f,
      memo: Base64.encode64(
        {
          t: 'swap',
          a: fill_asset_id,
          m: min_amount.presence&.to_f&.to_s
        }.to_json
      )
    ).find_or_create_by!(
      trace_id: trace_id
    )
  end

  private

  def set_defaults
    return unless new_record?

    assign_attributes(
      trace_id: SecureRandom.uuid
    )
  end
end
