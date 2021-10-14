# frozen_string_literal: true

# == Schema Information
#
# Table name: ifttb_orders
#
#  id         :uuid             not null, primary key
#  amount     :decimal(, )
#  amount_usd :decimal(, )
#  order_type :string
#  state      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  asset_id   :uuid
#  user_id    :uuid
#
# Indexes
#
#  index_ifttb_orders_on_user_id  (user_id)
#
class IfttbOrder < ApplicationRecord
  MONTHLY_PRICE_USD = 4.99
  YEARLY_PRICE_USD = 49.9
  ACCEPTABLE_ASSETS_IDS = %w[
    31d2ea9c-95eb-3355-b65b-ba096853bc18
    c6d0c728-2624-429b-8e0d-d9d19b6592fa
    c94ac88f-4671-3976-b60a-09064f1811e8
  ].freeze

  extend Enumerize
  include AASM

  belongs_to :user
  belongs_to :mixin_asset, primary_key: :asset_id, foreign_key: :asset_id, inverse_of: false

  before_validation :set_defaults, on: :create

  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0.000_000_01 }
  validates :amount_usd, presence: true, numericality: { greater_than_or_equal_to: 0.000_000_01 }

  enumerize :order_type, in: %w[pro_monthly pro_yearly], scope: true, predicates: true, default: :pro_monthly

  aasm column: :state do
    state :drafted
    state :paid
    state :completed

    event :pay, after: :upgrade_pro! do
      transitions from: :drafted, to: :paid
    end

    event :complete do
      transitions from: :paid, to: :completed
    end
  end

  def upgrade_pro!
    case order_type.to_sym
    when :pro_monthly
      user.ifttb_upgrade_pro 1.month
    when :pro_yearly
      user.ifttb_upgrade_pro 1.year
    end

    complete!
  end

  def pay_url
    format(
      'mixin://pay?recipient=%<recipient>s&asset=%<asset>s&amount=%<amount>s&memo=%<memo>s&trace=%<trace>s',
      recipient: recipient_id,
      asset: asset_id,
      amount: format('%.8f', amount),
      memo: Base64.strict_encode64("IFTTB|#{order_type}"),
      trace: id
    )
  end

  def price_usd
    case order_type.to_sym
    when :pro_monthly
      MONTHLY_PRICE_USD
    when :pro_yearly
      YEARLY_PRICE_USD
    end
  end

  def recipient_id
    admin = User.find_by mixin_uuid: Settings.admin_mixin_uuid
    raise 'Admin not ready' if admin.blank?

    admin.ifttb_broker.mixin_uuid
  end

  private

  def set_defaults
    assign_attributes(
      amount: (price_usd / mixin_asset.price_usd).round(8),
      amount_usd: price_usd
    )
  end
end
