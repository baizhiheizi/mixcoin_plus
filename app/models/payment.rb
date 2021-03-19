# frozen_string_literal: true

# == Schema Information
#
# Table name: payments
#
#  id              :bigint           not null, primary key
#  amount          :decimal(, )
#  memo            :string
#  raw             :json
#  state           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  asset_id        :uuid
#  conversation_id :uuid
#  opponent_id     :uuid
#  snapshot_id     :uuid
#  trace_id        :uuid
#
# Indexes
#
#  index_payments_on_asset_id  (asset_id)
#  index_payments_on_trace_id  (trace_id) UNIQUE
#
class Payment < ApplicationRecord
  include AASM

  belongs_to :payer, class_name: 'User', foreign_key: :opponent_id, primary_key: :mixin_uuid, inverse_of: :payments, optional: true
  belongs_to :snapshot, class_name: 'MixinNetworkSnapshot', foreign_key: :trace_id, primary_key: :trace_id, optional: true, inverse_of: false
  belongs_to :asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false, optional: true

  before_validation :setup_attributes, on: :create

  validates :trace_id, presence: true, uniqueness: true

  aasm column: :state do
    state :pending, initial: true
    state :paid
    state :completed
    state :refunded

    event :pay do
      transitions from: :pending, to: :paid
    end

    event :complete do
      transitions from: :paid, to: :completed
    end

    event :refund do
      transitions from: :paid, to: :refunded
    end
  end

  def decrypted_memo
    @decrypted_memo =
      begin
        JSON.parse Base64.decode64(memo.to_s)
      rescue JSON::ParserError
        {}
      end
  end

  private

  def setup_attributes
    return unless new_record?

    assign_attributes(
      trace_id: SecureRandom.uuid
    )
  end
end
