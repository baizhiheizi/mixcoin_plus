# frozen_string_literal: true

# == Schema Information
#
# Table name: mixin_network_users
#
#  id                  :uuid             not null, primary key
#  encrypted_pin       :string
#  mixin_uuid          :uuid
#  name                :string
#  ocean_private_key   :string
#  owner_type          :string
#  pin_token           :string
#  private_key         :string
#  raw                 :json
#  state               :string
#  type(STI)           :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  owner_id            :uuid
#  session_id          :uuid
#
# Indexes
#
#  index_mixin_network_users_on_mixin_uuid               (mixin_uuid) UNIQUE
#  index_mixin_network_users_on_owner_id_and_owner_type  (owner_id,owner_type)
#
class Arbitrager < MixinNetworkUser
  include MixinNetworkUsers::Oceanable

  has_many :arbitrage_orders, primary_key: :mixin_uuid, dependent: :restrict_with_exception

  after_initialize :set_default_name, if: :new_record?

  def default_name
    "Arbitrager##{Arbitrager.count + 1}"
  end

  def net_profit
    arbitrage_orders
      .without_drafted
      .includes(:profit_asset)
      .map(&->(order) { order.net_profit.to_f * order.profit_asset.price_usd })
      .sum
  end

  private

  def set_default_name
    self.name = default_name
  end
end
