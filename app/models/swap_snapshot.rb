# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_network_snapshots
#
#  id             :uuid             not null, primary key
#  amount         :decimal(, )
#  amount_usd     :decimal(, )      default(0.0)
#  data           :string
#  processed_at   :datetime
#  raw            :json
#  snapshot_type  :string
#  source_type    :string
#  transferred_at :datetime
#  type           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  asset_id       :uuid
#  opponent_id    :uuid
#  snapshot_id    :uuid
#  source_id      :uuid
#  trace_id       :uuid
#  user_id        :uuid
#
# Indexes
#
#  index_mixin_network_snapshots_on_source_id_and_source_type  (source_id,source_type)
#  index_mixin_network_snapshots_on_trace_id                   (trace_id) UNIQUE
#  index_mixin_network_snapshots_on_user_id                    (user_id)
#
class SwapSnapshot < MixinNetworkSnapshot
  extend Enumerize

  enumerize :snapshot_type,
            in: %i[default swap_from_user swap_to_fox trade_from_fox trade_to_user reject_from_fox reject_to_user swap_to_mix_swap trade_from_mix_swap refund_from_mix_swap]

  alias swap_order source

  def process!
    return if processed?

    if decrypted_swap_order.present?
      process_swap_order_snapshot
    elsif decrypted_applet_activity.present?
      decrypted_applet_activity.complete! if decrypted_applet_activity.may_complete?

      update(
        source: decrypted_applet_activity,
        snapshot_type: decrypted_snapshot_type,
        processed_at: Time.current,
        amount_usd: asset.price_usd.to_f * amount
      )
    end
  end

  def process_swap_order_snapshot
    _swap_order = decrypted_swap_order
    _snapshot_type = decrypted_snapshot_type

    case _snapshot_type.to_sym
    when :swap_from_user
      raise 'Invalid Payment' unless (amount - _swap_order.pay_amount).zero? && asset_id == _swap_order.pay_asset_id

      _swap_order.pay!
    when :swap_to_fox, :swap_to_mix_swap
      _swap_order.swap! if _swap_order.may_swap?
    when :trade_from_fox
      case _swap_order
      when ArbitrageSwapOrder
        _swap_order.trade! if _swap_order.may_trade?
      when AppletActivitySwapOrder
        MixinTransfer.create_with(
          source: _swap_order,
          user_id: _swap_order.broker.mixin_uuid,
          transfer_type: :swap_order_trade,
          opponent_id: _swap_order.user.mixin_uuid,
          asset_id: asset_id,
          amount: amount,
          memo: Base64.strict_encode64("SWAP|TRADE|#{_swap_order.trace_id}")
        ).find_or_create_by!(
          trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _swap_order.trace_id)
        )
      end
    when :trade_to_user
      _swap_order.trade! if _swap_order.may_trade?
    when :reject_from_fox
      case _swap_order
      when ArbitrageSwapOrder, AppletActivitySwapOrder
        _swap_order.reject!
      else
        MixinTransfer.create_with(
          source: _swap_order,
          user_id: _swap_order.broker.mixin_uuid,
          transfer_type: :swap_order_reject,
          opponent_id: _swap_order.user.mixin_uuid,
          asset_id: asset_id,
          amount: amount,
          memo: Base64.strict_encode64("SWAP|REJECT|#{_swap_order.trace_id}")
        ).find_or_create_by!(
          trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _swap_order.trace_id)
        )
      end
    when :refund_from_mix_swap
      _swap_order.refresh_state!
      _swap_order.reject! if _swap_order.may_reject?
    when :reject_to_user
      _swap_order.reject! if _swap_order.may_reject?
    when :trade_from_mix_swap
      MixinTransfer.create_with(
        source: _swap_order,
        user_id: _swap_order.broker.mixin_uuid,
        transfer_type: :swap_order_trade,
        opponent_id: _swap_order.user.mixin_uuid,
        asset_id: asset_id,
        amount: amount,
        memo: Base64.strict_encode64("SWAP|TRADE|#{_swap_order.trace_id}")
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _swap_order.trace_id)
      )
    end

    update!(
      source: decrypted_swap_order,
      snapshot_type: decrypted_snapshot_type,
      processed_at: Time.current,
      amount_usd: asset.price_usd.to_f * amount
    )
  end

  def decrypted_applet_activity
    transfer = MixinTransfer.find_by trace_id: raw['trace_id']
    transfer&.source if transfer.source.is_a?(AppletActivity)
  end

  # associate to swap_order
  def decrypted_swap_order
    return if raw['user_id'] == MixcoinPlusBot.api.client_id

    # from broker to fox
    _swap_order ||= SwapOrder.find_by(trace_id: raw['trace_id'])

    # from user to broker
    _swap_order ||= SwapOrder.find_by(id: raw['trace_id'])

    _swap_order ||=
      # from broker to user
      if base64_decoded_memo.match?(/^SWAP/)
        SwapOrder.find_by(trace_id: base64_decoded_memo.split('|')[2])
      elsif decrypted_json_memo.present?
        # from fox to broker
        SwapOrder.find_by(trace_id: decrypted_json_memo['t'])
      elsif base64_decoded_memo.match?(/^(0|1)/)
        # from MixSwap to broker
        SwapOrder.find_by(trace_id: base64_decoded_memo.split('|')[1])
      end

    _swap_order
  end

  def decrypted_snapshot_type
    if (opponent_id.blank? && amount.negative?) || decrypted_json_memo['t'] == 'swap'
      'swap_to_fox'
    elsif decrypted_json_memo.present?
      case decrypted_json_memo['s']
      when '4swapTrade'
        'trade_from_fox'
      when '4swapRefund'
        'reject_from_fox'
      end
    elsif base64_decoded_memo.match?(/^SWAP/)
      {
        CREATE: 'swap_from_user',
        TRADE: 'trade_to_user',
        REJECT: 'reject_to_user'
      }[base64_decoded_memo.split('|')[1]&.to_sym]
    elsif base64_decoded_memo.match?(/^(0|1)/)
      _source = base64_decoded_memo.split('|')[2]
      _type = base64_decoded_memo.split('|')[3]

      case [_source, _type].join.to_sym
      when :SNRF, :ATRF
        'refund_from_mix_swap'
      when :ATRL
        'trade_from_mix_swap'
      else
        'swap_to_mix_swap'
      end
    end
  end
end
