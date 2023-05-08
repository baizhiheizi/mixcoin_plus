# frozen_string_literal: true

module SwapOrders::MixSwappable
  extend ActiveSupport::Concern

  MINIMUM_AMOUNT = 0.000_000_01
  MIX_SWAP_CLIENT_ID = '6a4a121d-9673-4a7e-a93e-cb9ca4bb83a2'

  included do
    belongs_to :user, optional: true

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

      event :reject, after: :after_reject do
        transitions from: :swapping, to: :rejected
      end
    end
  end

  def create_swap_transfer!
    transfers.create_with(
      wallet: broker,
      transfer_type: :swap_order_create,
      priority: :critical,
      opponent_id: MIX_SWAP_CLIENT_ID,
      asset_id: pay_asset_id,
      amount: pay_amount.to_f,
      memo: memo
    ).find_or_create_by!(
      trace_id: trace_id
    )
  end

  def memo
    Base64.strict_encode64("0|#{fill_asset_id}|#{route_id}|#{min_amount && format('%.8f', min_amount)}")
  end

  def sync_order
    r = order_detail
    return if order_detail['data'].blank?

    update!(
      fill_amount: r['data']['receiveAmount'],
      refund_amount: r['data']['refundAmount'],
      raw: r['data']
    )
  end

  def after_trade
    sync_order
  end

  def after_reject
    sync_order
  end

  def order_detail
    @order_detail ||= MixSwap.api.order(trace_id)
  end

  def refresh_state!
    r = order_detail&.[]('data')
    return if r.blank?
    return if r&.[]('orderStatus') == 'done'

    if r&.[]('refundAmount').to_f < pay_amount
      trade! if may_trade?
    elsif may_refund?
      refund!
    end
  end
end
