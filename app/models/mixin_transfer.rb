# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_transfers
#
#  id            :bigint           not null, primary key
#  amount        :decimal(, )
#  memo          :string
#  priority      :integer
#  processed_at  :datetime
#  snapshot      :json
#  source_type   :string
#  transfer_type :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  asset_id      :uuid
#  opponent_id   :uuid
#  source_id     :bigint
#  trace_id      :uuid
#  user_id       :uuid
#
# Indexes
#
#  index_mixin_transfers_on_source    (source_type,source_id)
#  index_mixin_transfers_on_trace_id  (trace_id) UNIQUE
#  index_mixin_transfers_on_user_id   (user_id)
#
class MixinTransfer < ApplicationRecord
  MINIMUM_AMOUNT = 0.000_000_01

  belongs_to :source, polymorphic: true
  belongs_to :wallet, class_name: 'MixinNetworkUser', primary_key: :uuid, inverse_of: :transfers, optional: true
  belongs_to :recipient, class_name: 'User', primary_key: :mixin_uuid, foreign_key: :opponent_id, inverse_of: :transfers, optional: true
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: :transfers, optional: true

  enum priority: { default: 0, critical: 1, high: 2, low: 3 }, _prefix: true
  enum transfer_type: {
    default: 0
  }

  validates :trace_id, presence: true, uniqueness: true
  validates :asset_id, presence: true
  validates :opponent_id, presence: true
  validates :amount, numericality: { greater_than_or_equal_to: MINIMUM_AMOUNT }

  after_commit :process_async, on: :create

  scope :unprocessed, -> { where(processed_at: nil) }
  scope :processed, -> { where.not(processed_at: nil) }

  def snapshot_id
    snapshot&.[]('snapshot_id')
  end

  def processed?
    processed_at?
  end

  def process!
    return if processed?

    r =
      if wallet.blank?
        MixcoinPlusBot.api.create_transfer(
          Rails.application.credentials.dig(:prsdigg_bot, :pin_code),
          {
            asset_id: asset_id,
            opponent_id: opponent_id,
            amount: amount,
            trace_id: trace_id,
            memo: memo
          }
        )
      else
        wallet.mixin_api.create_transfer(
          wallet.pin,
          {
            asset_id: asset_id,
            opponent_id: opponent_id,
            amount: amount,
            trace_id: trace_id,
            memo: memo
          }
        )
      end

    return unless r['data']['trace_id'] == trace_id

    # TODO: callback after transferred
  end

  def price_tag
    [format('%.8f', amount), asset.symbol].join(' ')
  end

  def process_async
    if priority_critical?
      ProcessCriticalTransferWorker.perform_async trace_id
    else
      ProcessTransferWorker.perform_async trace_id
    end
  end
end
