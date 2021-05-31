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
            in: %i[default swap_from_user swap_to_fox trade_from_fox trade_to_user reject_from_fox reject_to_user]

  def process!
    return if amount.negative?

    swap_order = SwapOrder.find_by trace_id: decrypted_memo['t']

    case decrypted_memo['s']
    when '4swapTrade'
      swap_order.update! amount: amount
      swap_order.trade! if swap_order.swapping?
    when '4swapRefund'
      swap_order.reject!
    end
  end
end
