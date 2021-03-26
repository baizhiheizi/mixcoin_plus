# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_transfers
#
#  id            :uuid             not null, primary key
#  amount        :decimal(, )
#  memo          :string
#  priority      :string
#  processed_at  :datetime
#  snapshot      :json
#  source_type   :string
#  transfer_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  asset_id      :uuid
#  opponent_id   :uuid
#  source_id     :uuid
#  trace_id      :uuid
#  user_id       :uuid
#
# Indexes
#
#  index_mixin_transfers_on_source_id_and_source_type  (source_id,source_type)
#  index_mixin_transfers_on_trace_id                   (trace_id) UNIQUE
#  index_mixin_transfers_on_user_id                    (user_id)
#
class MixinTransfer < ApplicationRecord
  MINIMUM_AMOUNT = 0.000_000_01

  extend Enumerize

  belongs_to :source, polymorphic: true, optional: true
  belongs_to :wallet, class_name: 'MixinNetworkUser', primary_key: :mixin_uuid, foreign_key: :user_id, inverse_of: :transfers, optional: true
  belongs_to :recipient, class_name: 'User', primary_key: :mixin_uuid, foreign_key: :opponent_id, inverse_of: :transfers, optional: true
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: :transfers, optional: true

  validates :trace_id, presence: true, uniqueness: true
  validates :asset_id, presence: true
  validates :opponent_id, presence: true
  validates :amount, numericality: { greater_than_or_equal_to: MINIMUM_AMOUNT }

  after_commit :process_async, on: :create

  enumerize :priority, in: %i[default critical high low], default: :default, predicates: true
  enumerize :transfer_type,
            in: %i[default ocean_broker_balance ocean_broker_register ocean_order_create ocean_order_cancel ocean_order_match ocean_order_refund],
            default: :default,
            predicates: true

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
          Rails.application.credentials.dig(:mixin, :pin_code),
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

    # case transfer_type.to_sym
    # when :ocean_broker_balance
    #   source.balance! if source.may_balance?
    # when :ocean_broker_register
    #   source.ready! if source.may_ready?
    # end

    update processed_at: Time.current, snapshot: r['data']
  end

  def price_tag
    [format('%.8f', amount), asset.symbol].join(' ')
  end

  def process_async
    if critical?
      MixinTransferCriticalProcessWorker.perform_async id
    else
      MixinTransferProcessWorker.perform_async id
    end
  end
end