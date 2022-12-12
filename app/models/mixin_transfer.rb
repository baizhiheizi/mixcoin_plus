# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_transfers
#
#  id                :uuid             not null, primary key
#  amount            :decimal(, )
#  amount_usd        :decimal(, )      default(0.0)
#  memo              :string
#  opponent_multisig :json
#  priority          :string
#  processed_at      :datetime
#  snapshot          :json
#  source_type       :string
#  transfer_type     :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  asset_id          :uuid
#  opponent_id       :uuid
#  source_id         :uuid
#  trace_id          :uuid
#  user_id           :uuid
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

  store :opponent_multisig, accessors: %i[receivers threshold]

  belongs_to :source, polymorphic: true, optional: true
  belongs_to :wallet, class_name: 'MixinNetworkUser', primary_key: :mixin_uuid, foreign_key: :user_id, inverse_of: :transfers, optional: true
  belongs_to :recipient, class_name: 'User', primary_key: :mixin_uuid, foreign_key: :opponent_id, inverse_of: :transfers, optional: true
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false, optional: true

  before_validation :set_defaults, on: :create

  validates :trace_id, presence: true, uniqueness: true
  validates :asset_id, presence: true
  validates :amount, numericality: { greater_than_or_equal_to: MINIMUM_AMOUNT }
  validate :ensure_opponent_presence

  after_commit :process_async, on: :create

  enumerize :priority, in: %i[default critical high low], default: :default, predicates: true
  enumerize :transfer_type,
            in: %i[default ocean_broker_balance ocean_broker_register ocean_order_create ocean_order_cancel ocean_order_match ocean_order_refund ocean_order_group_owner_commission ocean_order_invitation_commission ocean_order_mixcoin_fee swap_order_create swap_order_trade swap_order_reject withdraw_to_admin booking_order_activity_bonus withdraw_to_user],
            default: :default,
            scope: true,
            predicates: true

  scope :unprocessed, -> { where(processed_at: nil) }
  scope :processed, -> { where.not(processed_at: nil) }
  scope :within_24h, -> { where(created_at: (24.hours.ago)...) }

  def snapshot_id
    snapshot&.[]('snapshot_id')
  end

  def processed?
    processed_at?
  end

  def process!
    return if processed?

    r =
      if user_id == MixcoinPlusBot.api.client_id
        MixcoinPlusBot.api.create_transfer(
          Settings.mixin.pin_code,
          {
            asset_id: asset_id,
            opponent_id: opponent_id,
            amount: amount,
            trace_id: trace_id,
            memo: memo
          }
        )
      elsif wallet.present?
        if opponent_id.present?
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
        elsif opponent_multisig.present?
          wallet.mixin_api.create_multisig_transaction(
            wallet.pin,
            {
              asset_id: asset_id,
              receivers: receivers,
              threshold: threshold,
              amount: amount,
              trace_id: trace_id,
              memo: memo
            }
          )
        end
      end

    return unless r['data']['trace_id'] == trace_id

    update(
      processed_at: Time.current,
      snapshot: r['data'],
      amount_usd: asset.price_usd.to_f * amount
    )
    TransferProcessedNotification.with(transfer: self).deliver(recipient) if recipient.present?
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

  private

  def set_defaults
    self.trace_id = SecureRandom.uuid if trace_id.blank?
  end

  def ensure_opponent_presence
    errors.add(:opponent_id, ' must cannot be blank') if opponent_id.blank? && opponent_multisig.blank?
  end
end
