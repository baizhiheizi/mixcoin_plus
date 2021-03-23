# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_network_snapshots
#
#  id             :uuid             not null, primary key
#  amount         :decimal(, )
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
            in: %i[default ocean_broker_balance ocean_broker_register create_order_from_user create_order_to_engine refund_from_engine refund_to_user match_from_engine match_to_user]

  alias ocean_order source

  def decrypted_memo
    @decrypted_memo =
      if data.to_s.match?(/^OCEAN/)
        data
      else
        begin
          MessagePack.unpack(Base64.decode64(data.gsub('-', '+').gsub('_', '/')))
        rescue StandardError
          {}
        end
      end
  end

  def process!
    return if processed?

    update!(
      source: decrypted_ocean_order,
      snapshot_type: decrypted_snapshot_type
    )

    case decrypted_snapshot_type.to_sym
    when :ocean_broker_balance
      wallet.balance! if wallet.may_balance?
    when :ocean_broker_register
      wallet.ready! if wallet.may_ready?
    when :create_order_from_user
      raise 'Invalid Payment' unless (amount.to_f - ocean_order.payment_amount.to_f).zero? && asset_id == ocean_order.payment_asset_id

      ocean_order.pay!
    when :create_order_to_engine
      ocean_order.book! if ocean_order.may_book?
    when :match_from_engine
      MixinTransfer.create_with(
        source: ocean_order,
        user_id: ocean_order.broker.mixin_uuid,
        transfer_type: :ocean_order_match,
        opponent_id: ocean_order.user.mixin_uuid,
        asset_id: asset_id,
        amount: amount,
        memo: "OCEAN|MATCH|#{ocean_order.trace_id}"
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, ocean_order.trace_id)
      )
    when :match_to_user
      ocean_order.match!
    when :refund_from_engine
      MixinTransfer.create_with(
        source: ocean_order,
        user_id: ocean_order.broker.mixin_uuid,
        transfer_type: :ocean_order_refund,
        opponent_id: ocean_order.user.mixin_uuid,
        asset_id: asset_id,
        amount: amount,
        memo: "OCEAN|REFUND|#{ocean_order.trace_id}"
      ).find_or_create_by!(
        trace_id: MixcoinPlusBot.api.unique_uuid(trace_id, ocean_order.trace_id)
      )
    when :refund_to_user
      ocean_order.refund! if ocean_order.may_refund?
    else
      raise 'Not valid memo!'
    end

    update processed_at: Time.current
  end

  # associate to ocean_order
  def decrypted_ocean_order
    return if raw['user_id'] == MixcoinPlusBot.api.client_id

    # from user to broker
    _ocean_order = OceanOrder.find_by(id: raw['trace_id'])
    return _ocean_order if _ocean_order.present?

    # from broker to engine, for create order
    # trace_id same as ocean_order's
    _ocean_order = OceanOrder.find_by(trace_id: raw['trace_id'])
    return _ocean_order if _ocean_order.present?

    # from engine to broker
    # 'O' in memo
    _init_order_id = raw_to_uuid(decrypted_memo['O'])
    _ocean_order = OceanOrder.find_by(trace_id: _init_order_id)
    return _ocean_order if _ocean_order.present?

    # from engine to broker
    # match transfer, 'A' in memo for AskOrderId
    _ask_order_id = raw_to_uuid(decrypted_memo['A'])
    _ocean_order = OceanOrder.find_by(trace_id: _ask_order_id, side: 'ask', quote_asset_id: raw['asset']['asset_id'])
    return _ocean_order if _ocean_order.present?

    # from engine to broker
    # match transfer, 'B' for 'BidOrderId'
    _bid_order_id = raw_to_uuid(decrypted_memo['B'])
    _ocean_order = OceanOrder.find_by(trace_id: _bid_order_id, side: 'bid', base_asset_id: raw['asset']['asset_id'])
    return _ocean_order if _ocean_order.present?
  end

  def decrypted_snapshot_type
    if raw['opponent_id'] == OceanBroker::OCEAN_ENGINE_USER_ID
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
    elsif data.match?(/^OCEAN/)
      case data.split('|')[1]
      when 'REFUND', 'CANCEL'
        'refund_to_user'
      when 'MATCH'
        'match_to_user'
      when 'CREATE'
        'create_order_from_user'
      when 'BALANCE'
        'ocean_broker_balance'
      end
    end
  end

  private

  def raw_to_uuid(raw)
    return if raw.nil?

    case raw
    when String
      raw = raw.bytes.pack('c*')
    when Array
      raw = raw.pack('c*')
    end

    raw = raw.unpack1('H*').to_s
    format(
      '%<first>s-%<second>s-%<third>s-%<forth>s-%<fifth>s',
      first: raw[0..7],
      second: raw[8..11],
      third: raw[12..15],
      forth: raw[16..19],
      fifth: raw[20..]
    )
  rescue StandardError
    nil
  end
end
