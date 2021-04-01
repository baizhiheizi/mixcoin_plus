# frozen_string_literal: true

class DecryptedDeprecatedOrdersService
  def call(snapshots)
    snapshots = snapshots.map(&->(snapshot) { MixinNetworkSnapshot.new raw: snapshot })
    done_order_snapshots = snapshots.filter(&->(snapshot) { snapshot.decrypted_memo['S'].in?(%w[FILL CANCEL REFUND]) || (snapshot.amount.negative? && snapshot.decrypted_memo['O'].present?) })
    open_order_snapshots = snapshots.filter(&->(snapshot) { snapshot.amount.negative? && snapshot.decrypted_memo['O'].blank? && snapshot.decrypted_memo['S'].present? && snapshot.decrypted_memo['A'].present? && snapshot.decrypted_memo['T'].present? })

    remaining_order_snapshots = []

    open_order_snapshots.each do |snapshot|
      next if done_order_snapshots.find(&->(s) { s.raw_to_uuid(s.decrypted_memo['O']) == snapshot.trace_id })

      remaining_order_snapshots.push snapshot
    end

    remaining_order_snapshots.map do |snapshot|
      base_asset_id = snapshot.decrypted_memo['S'] == 'A' ? snapshot.asset_id : snapshot.raw_to_uuid(snapshot.decrypted_memo['A'])
      quote_asset_id = snapshot.decrypted_memo['S'] == 'A' ? snapshot.raw_to_uuid(snapshot.decrypted_memo['A']) : snapshot.asset_id
      OceanOrder.new(
        base_asset: MixinAsset.find_by(asset_id: base_asset_id),
        quote_asset: MixinAsset.find_by(asset_id: quote_asset_id),
        price: snapshot.decrypted_memo['P'].to_f,
        side: snapshot.decrypted_memo['S'] == 'A' ? 'ask' : 'bid',
        order_type: snapshot.decrypted_memo['T'] == 'L' ? 'limit' : 'market',
        trace_id: snapshot.trace_id,
        created_at: snapshot.transferred_at
      )
    end
  end
end
