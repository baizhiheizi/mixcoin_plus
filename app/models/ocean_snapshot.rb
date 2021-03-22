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
#  source_id      :bigint
#  trace_id       :uuid
#  user_id        :uuid
#
# Indexes
#
#  index_mixin_network_snapshots_on_source    (source_type,source_id)
#  index_mixin_network_snapshots_on_trace_id  (trace_id) UNIQUE
#  index_mixin_network_snapshots_on_user_id   (user_id)
#
class OceanSnapshot < MixinNetworkSnapshot
  extend Enumerize

  enumerize :snapshot_type, in: %i[default register_to_engine create_order_from_user create_order_to_engin refund_to_user match_from_engine match_to_user]

  alias ocean_order source

  def decrypted_memo
    @decrypted_memo =
      if data.to_s.match?(/^OCEAN/)
        data
      else
        begin
          JSON.parse Base64.decode64(data.to_s)
        rescue JSON::ParserError
          {}
        end
      end
  end

  def process!
    return if processed?

    update(
      source: decrypted_ocean_order,
      snapshot_type: decrypted_snapshot_type
    )

    case decrypted_snapshot_type
    when 'create_order_from_user'
      create_ocean_order!
    when 'refund_from_engine'
      decrypted_ocean_order&.transfer_to_user_for_refunding data, asset_id, amount, trace_id_of_forward_from_engine_to_user
    when 'match_from_engine'
      decrypted_ocean_order&.transfer_to_user_for_matching data, asset_id, amount, trace_id_of_forward_from_engine_to_user
    end
  end

  def create_ocean_order!
    order = OceanOrder.create!(
      user: user,
      broker: wallet,
      base_asset_id: decrypted_memo['S'] == 'A' ? asset_id : opponent_asset_id,
      quote_asset_id: decrypted_memo['S'] == 'A' ? opponent_asset_id : asset_id,
      price: decrypted_memo['P'].to_f,
      remaining_amount: if decrypted_memo['S'] == 'A'
                          amount.round(8)
                        else
                          (decrypted_memo['T'] == 'L' ? amount / decrypted_memo['P'].to_f : 0.0).round(8)
                        end,
      remaining_funds: (decrypted_memo['S'] == 'A' ? amount * decrypted_memo['P'].to_f : amount).round(8),
      side: decrypted_memo['S'] == 'A' ? 'ask' : 'bid',
      order_type: decrypted_memo['T'] == 'L' ? 'limit' : 'market',
      trace_id: OhmyBot.api.unique_conversation_id(trace_id, user_id)
    )
    update! ocean_order: order
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error e.record.errors
    refund_for_invalid_order
  end

  def refund_for_invalid_order
  end

  private

  # associate to ocean_order
  def decrypted_ocean_order
    return if raw['user_id'] == MixcoinPlusBot.api.client_id

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
    return 'default' if raw['user_id'] == MixcoinPlusBot.api.client_id

    if raw['opponent_id'] == MixinNetworkBroker::OCEAN_ENGINE_USER_ID
      if raw['amount'].to_f.negative?
        # to engine
        return 'register_to_engine' if decrypted_memo['U'].present?
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
      end
    end
  end

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
