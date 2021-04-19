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
class OceanSnapshot < MixinNetworkSnapshot
  extend Enumerize

  enumerize :snapshot_type,
            in: %i[default ocean_broker_balance ocean_broker_register create_order_from_user create_order_to_engine cancel_order_to_engine refund_from_engine refund_to_user match_from_engine match_to_user],
            default: :default,
            scope: true,
            predicates: true

  alias ocean_order source

  scope :match_from_engine, -> { where(snapshot_type: :match_from_engine) }

  def ocean_fee
    return 0 unless decrypted_snapshot_type == 'match_from_engine'

    decrypted_memo['F'].to_f
  end

  def extra_fee
    return 0 unless decrypted_snapshot_type == 'match_from_engine'

    if ocean_fee.positive?
      (OceanOrder::TAKER_FEE_RATIO * amount).round(8)
    else
      (OceanOrder::MAKER_FEE_RATIO * amount).round(8)
    end
  end

  def fee
    ocean_fee + extra_fee
  end

  def process_match_from_engine
    return unless decrypted_snapshot_type == 'match_from_engine'

    _ocean_order = decrypted_ocean_order
    raise 'Not from order broker' unless _ocean_order&.broker&.mixin_uuid == user_id

    group_owner_commission_amount = (_ocean_order.group_owner_commission_ratio * extra_fee).floor(8)
    invitation_commission_amount = (_ocean_order.invitation_commission_ratio * extra_fee).floor(8)
    mixcoin_fee_amount = extra_fee - group_owner_commission_amount - invitation_commission_amount
    _amount = amount - group_owner_commission_amount - invitation_commission_amount - mixcoin_fee_amount

    # Group Owner Commission
    if group_owner_commission_amount.positive?
      MixinTransfer.create_with(
        source: _ocean_order,
        user_id: user_id,
        transfer_type: :ocean_order_group_owner_commission,
        opponent_id: _ocean_order.conversation.creator_id,
        asset_id: asset_id,
        amount: group_owner_commission_amount,
        memo: 'Group Owner Commission'
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _ocean_order.conversation.creator_id)
      )
    end

    # Invitation Commission
    if invitation_commission_amount.positive?
      MixinTransfer.create_with(
        source: _ocean_order,
        user_id: user_id,
        transfer_type: :ocean_order_invitation_commission,
        opponent_id: _ocean_order.user.invitor.mixin_uuid,
        asset_id: asset_id,
        amount: invitation_commission_amount,
        memo: 'Invitation Commission'
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _ocean_order.user.invitor.mixin_uuid)
      )
    end

    # Mixcoin Fee
    if mixcoin_fee_amount.positive?
      MixinTransfer.create_with(
        source: _ocean_order,
        user_id: user_id,
        transfer_type: :ocean_order_mixcoin_fee,
        opponent_id: MixcoinPlusBot.api.client_id,
        asset_id: asset_id,
        amount: mixcoin_fee_amount,
        memo: 'Mixcoin Fee'
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, MixcoinPlusBot.api.client_id)
      )
    end

    return unless _amount.positive?

    # Match To User
    MixinTransfer.create_with(
      source: _ocean_order,
      user_id: user_id,
      transfer_type: :ocean_order_match,
      opponent_id: _ocean_order.user.mixin_uuid,
      asset_id: asset_id,
      amount: _amount,
      memo: Base64.strict_encode64("OCEAN|MATCH|#{_ocean_order.trace_id}")
    ).find_or_create_by!(
      trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _ocean_order.user.mixin_uuid)
    )
  end

  def process!
    return if processed?

    _ocean_order = decrypted_ocean_order
    _snapshot_type = decrypted_snapshot_type

    case _snapshot_type.to_sym
    when :ocean_broker_balance
      _broker = OceanBroker.find_by(mixin_uuid: opponent_id)
      _broker.balance! if _broker.may_balance?
    when :ocean_broker_register
      wallet.ready! if wallet.balanced?
    when :create_order_from_user
      raise 'Invalid Payment' unless (amount.to_f - _ocean_order.payment_amount.to_f).zero? && asset_id == _ocean_order.payment_asset_id

      _ocean_order.pay!
    when :create_order_to_engine
      _ocean_order.book! if _ocean_order.may_book?
    when :match_from_engine
      process_match_from_engine
    when :match_to_user
      _ocean_order.match!
    when :cancel_order_to_engine
      _ocean_order.cancel! if _ocean_order.may_cancel?
    when :refund_from_engine
      MixinTransfer.create_with(
        source: _ocean_order,
        user_id: _ocean_order.broker.mixin_uuid,
        transfer_type: :ocean_order_refund,
        opponent_id: _ocean_order.user.mixin_uuid,
        asset_id: asset_id,
        amount: amount,
        memo: Base64.strict_encode64("OCEAN|REFUND|#{_ocean_order.trace_id}")
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, _ocean_order.trace_id)
      )
    when :refund_to_user
      _ocean_order.refund! if _ocean_order.may_refund?
    else
      raise 'Not valid memo!'
    end

    update!(
      source: decrypted_ocean_order,
      snapshot_type: decrypted_snapshot_type,
      processed_at: Time.current,
      amount_usd: asset.price_usd.to_f * amount
    )
  end

  # associate to ocean_order
  def decrypted_ocean_order
    return if raw['user_id'] == MixcoinPlusBot.api.client_id

    # from user to broker
    @_decrypted_ocean_order ||= OceanOrder.find_by(id: raw['trace_id'])

    # from broker to engine, for create order
    # trace_id same as ocean_order's
    @_decrypted_ocean_order ||= OceanOrder.find_by(trace_id: raw['trace_id'])

    # from broker to user
    @_decrypted_ocean_order ||= OceanOrder.find_by(trace_id: base64_decoded_memo.split('|')[2]) if base64_decoded_memo.match?(/^OCEAN/)

    # from engine to broker
    # 'O' in memo
    _init_order_id = decrypted_memo['O']
    @_decrypted_ocean_order ||= OceanOrder.find_by(trace_id: _init_order_id)

    # from engine to broker
    # match transfer, 'A' in memo for AskOrderId
    _ask_order_id = decrypted_memo['A']
    @_decrypted_ocean_order ||= OceanOrder.find_by(trace_id: _ask_order_id, side: 'ask', quote_asset_id: raw['asset']['asset_id'])

    # from engine to broker
    # match transfer, 'B' for 'BidOrderId'
    _bid_order_id = decrypted_memo['B']
    @_decrypted_ocean_order ||= OceanOrder.find_by(trace_id: _bid_order_id, side: 'bid', base_asset_id: raw['asset']['asset_id'])

    @_decrypted_ocean_order
  end

  def decrypted_snapshot_type
    @_decrypted_snapshot_type ||=
      if base64_decoded_memo.match?(/^OCEAN/)
        case base64_decoded_memo.split('|')[1]
        when 'REFUND', 'CANCEL'
          'refund_to_user'
        when 'MATCH'
          'match_to_user'
        when 'CREATE'
          'create_order_from_user'
        when 'BALANCE'
          'ocean_broker_balance'
        end
      elsif decrypted_memo.present?
        if raw['amount'].to_f.negative?
          # to engine
          return 'ocean_broker_register' if decrypted_memo['U'].present?
          return 'cancel_order_to_engine' if decrypted_memo['O'].present?
          return 'create_order_to_engine' if decrypted_memo['A'].present?
        else
          # from engine
          case decrypted_memo['S']
          when 'CANCEL', 'REFUND'
            'refund_from_engine'
          when 'MATCH'
            'match_from_engine'
          end
        end
      end
    @_decrypted_snapshot_type
  end
end
