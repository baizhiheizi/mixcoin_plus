# frozen_string_literal: true

# == Schema Information
#
# Table name: swap_orders
#
#  id                 :uuid             not null, primary key
#  fill_amount        :decimal(, )
#  min_amount         :decimal(, )
#  pay_amount         :decimal(, )
#  pay_amount_usd     :decimal(, )
#  raw                :json
#  refund_amount      :decimal(, )      default(0.0)
#  state              :string
#  type               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  applet_activity_id :uuid
#  arbitrage_order_id :uuid
#  broker_id          :uuid
#  fill_asset_id      :uuid
#  pay_asset_id       :uuid
#  route_id           :string
#  trace_id           :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_swap_orders_on_applet_activity_id  (applet_activity_id)
#  index_swap_orders_on_arbitrage_order_id  (arbitrage_order_id)
#  index_swap_orders_on_broker_id           (broker_id)
#  index_swap_orders_on_fill_asset_id       (fill_asset_id)
#  index_swap_orders_on_pay_asset_id        (pay_asset_id)
#  index_swap_orders_on_trace_id            (trace_id)
#  index_swap_orders_on_user_id             (user_id)
#
class SwapOrder < ApplicationRecord
  MINIMUM_AMOUNT = 0.000_000_01

  include AASM

  belongs_to :user, optional: true
  belongs_to :broker, class_name: 'MixinNetworkUser', primary_key: :mixin_uuid, inverse_of: :swap_orders
  belongs_to :pay_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false
  belongs_to :fill_asset, class_name: 'MixinAsset', primary_key: :asset_id, inverse_of: false

  has_many :snapshots, class_name: 'SwapSnapshot', as: :source, dependent: :restrict_with_exception
  has_many :transfers, class_name: 'MixinTransfer', as: :source, dependent: :restrict_with_exception

  before_validation :set_defaults, on: :create

  validates :pay_amount, numericality: { greater_than_or_equal_to: MINIMUM_AMOUNT }
  validates :trace_id, presence: true, uniqueness: true
  validate :pay_and_fill_asset_not_the_same

  scope :within_24h, -> { where(created_at: (24.hours.ago)...) }
  scope :without_drafted, -> { where.not(state: :drafted) }
  scope :without_finished, -> { where.not(state: %i[rejected traded]) }

  private

  def set_defaults
    return unless new_record?

    self.trace_id = SecureRandom.uuid if trace_id.blank?
    self.pay_amount_usd = pay_asset.price_usd * pay_amount
  end

  def pay_and_fill_asset_not_the_same
    errors.add(:fill_asset, ' is the same with pay asset') unless pay_asset_id != fill_asset_id
  end
end
