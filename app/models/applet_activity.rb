# frozen_string_literal: true

# == Schema Information
#
# Table name: applet_activities
#
#  id               :uuid             not null, primary key
#  state            :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  applet_action_id :uuid             not null
#  applet_id        :uuid
#
# Indexes
#
#  index_applet_activities_on_applet_action_id  (applet_action_id)
#  index_applet_activities_on_applet_id         (applet_id)
#
class AppletActivity < ApplicationRecord
  include AASM

  belongs_to :applet, counter_cache: true
  belongs_to :applet_action

  has_many :swap_orders, dependent: :restrict_with_exception

  after_create :log_applet_active

  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }
  scope :without_drafted, -> { where.not(state: :drafted) }

  aasm column: :state do
    state :drafted, initial: true
    state :failed
    state :completed

    event :fail, after: :notify_state do
      transitions from: :drafted, to: :failed
    end

    event :complete, after: %i[notify_state disconnect_applet_if_no_datetime_trigger] do
      transitions from: :drafted, to: :completed
    end
  end

  def notify_state
    return if applet&.user.blank?

    AppletActivityStateNotification.with(applet_activity: self).deliver(applet.user)
  end

  def notification_completed_text
    if swap_orders.present?
      swap_order_detail_text
    elsif applet_action.is_a?(AppletAlertAction)
      applet_action.data
    end
  end

  def swap_order_detail_text
    return if swap_orders.blank?

    swap_orders.map do |swap_order|
      _service =
        case swap_order
        when AppletActivitySwapOrder
          '4swap'
        when AppletActivityMixSwapOrder
          'MixSwap'
        end

      _pay_amount = swap_order.pay_amount - swap_order.refund_amount
      <<~DATA
        - 🤖: #{_service}
        - 🔁: #{_pay_amount} #{swap_order.pay_asset.symbol} -> #{swap_order.fill_amount} #{swap_order.fill_asset.symbol}
        - 🏷️: 1 #{swap_order.fill_asset.symbol} ≈ #{(_pay_amount / swap_order.fill_amount).round(8)} #{swap_order.pay_asset.symbol}
        - 🏷️: 1 #{swap_order.pay_asset.symbol} ≈ #{(swap_order.fill_amount / _pay_amount).round(8)} #{swap_order.fill_asset.symbol}
      DATA
    end.join("\n")
  end

  def notification_text
    case state.to_sym
    when :failed
      notification_state_text
    when :completed
      <<~TEXT
        #{notification_completed_text}
        ---
        #{notification_state_text}
        #{notification_triggers_text}
      TEXT
    end
  end

  def notification_state_text
    "Applet ##{applet.number} activity #{state}."
  end

  def notification_triggers_text
    applet.applet_triggers.map(&->(trigger) { "- #{trigger.description}" }).join("\n")
  end

  def disconnect_applet_if_no_datetime_trigger
    return if applet_action.is_a?(AppletAlertAction)

    applet.disconnect! if applet.applet_datetime_trigger.blank?
  end

  def log_applet_active
    applet.log_active
  end
end
