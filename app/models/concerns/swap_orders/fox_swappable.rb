# frozen_string_literal: true

module SwapOrders::FoxSwappable
  extend ActiveSupport::Concern

  MINIMUM_AMOUNT = 0.000_000_01
  FSWAP_MTG_MEMBERS = Settings.foxswap.mtg_members
  FSWAP_MTG_THRESHOLD = Settings.foxswap.mtg_threshold
  FSWAP_MTG_PUBLIC_KEY = Settings.foxswap.mtg_public_Key

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
      minimum_fill: min_amount && format('%.8f', min_amount)
    )

    r['data']['action']
  end

  def sync_order
    r = foxswap_order_detail

    self.raw = r['data']
    self.fill_amount = r['data']&.[]('fill_amount')
    self.refund_amount = fill_amount.blank? ? pay_amount : 0

    save
  end

  def after_trade
    sync_order
  end

  def after_reject
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
end
