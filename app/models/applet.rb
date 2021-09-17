# frozen_string_literal: true

# == Schema Information
#
# Table name: applets
#
#  id                      :uuid             not null, primary key
#  applet_activities_count :integer          default(0)
#  archived_at             :datetime
#  connected               :boolean          default(FALSE)
#  last_active_at          :datetime
#  title                   :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :uuid             not null
#
class Applet < ApplicationRecord
  belongs_to :user

  has_one :applet_datetime_trigger, dependent: :restrict_with_exception
  has_one :applet_action, dependent: :restrict_with_exception

  has_many :applet_triggers, dependent: :restrict_with_exception
  has_many :applet_actions, dependent: :restrict_with_exception
  has_many :applet_activities, dependent: :restrict_with_exception
  has_many :swap_orders, through: :applet_activities, dependent: :restrict_with_exception

  accepts_nested_attributes_for :applet_actions, update_only: true
  accepts_nested_attributes_for :applet_triggers, allow_destroy: true

  validate :must_has_triggers, on: :create
  validate :must_has_actions, on: :create
  validate :must_be_cron_format

  scope :within_24h, -> { where(created_at: (Time.current - 24.hours)...) }
  scope :connected, -> { where(connected: true) }
  scope :only_archived, -> { where.not(archived_at: nil) }
  scope :without_archived, -> { where(archived_at: nil) }

  def may_active?
    applet_triggers.map(&:match?).all?(true)
  end

  def active!
    return unless may_active?

    applet_actions.map(&:active!)
  end

  def active_async
    AppletActiveWorker.perform_async id
  end

  def may_connect?
    applet_actions.map(&:may_active?).all?(true)
  end

  def connect!
    return unless may_connect?

    update connected: true
    create_cron_job
  end

  def disconnect!
    update connected: false
    destroy_cron_job
    notify_disconnected
  end

  def toggle_connected
    if connected?
      disconnect!
    else
      connect!
    end
  end

  def log_active
    touch :last_active_at
  end

  def archive!
    disconnect! if connected?
    update! archived_at: Time.current
  end

  def cron_instance
    @cron_instance ||= Fugit.parse_cron cron
  end

  def cron_job
    @cron_job ||= Sidekiq::Cron::Job.find cron_job_name
  end

  def create_cron_job
    Sidekiq::Cron::Job.create(
      name: cron_job_name,
      class: 'AppletActiveWorker',
      cron: cron,
      args: id
    )
  end

  def destroy_cron_job
    Sidekiq::Cron::Job.destroy cron_job_name
  end

  def notify_disconnected
    AppletDisconnectedNotification.with(applet: self).deliver(user)
  end

  def number
    id.split('-').second.upcase
  end

  def traded_swap_orders
    @traded_swap_orders ||= swap_orders.where(state: :traded)
  end

  def pay_asset
    return if traded_swap_orders.blank?

    @pay_asset ||= traded_swap_orders.first.pay_asset
  end

  def pay_total
    return if traded_swap_orders.blank?

    @pay_total ||= traded_swap_orders.sum('pay_amount - refund_amount')
  end

  def pay_total_usd
    return if traded_swap_orders.blank?

    @pay_total_usd ||= traded_swap_orders.sum('(1 - refund_amount / pay_amount) * pay_amount_usd')
  end

  def fill_asset
    return if traded_swap_orders.blank?

    @fill_asset ||= traded_swap_orders.first.fill_asset
  end

  def fill_total
    return if traded_swap_orders.blank?

    @fill_total ||= traded_swap_orders.sum(:fill_amount)
  end

  def fill_total_usd
    return if traded_swap_orders.blank?

    @fill_total_usd ||= fill_total * fill_asset.price_usd
  end

  def profit
    return if traded_swap_orders.blank?

    @profit ||= ((fill_total_usd / pay_total_usd) - 1).to_f
  end

  def cron
    applet_datetime_trigger&.cron_value || default_cron
  end

  def frequency
    Fugit.parse_cron(cron).rough_frequency
  end

  private

  def cron_job_name
    "applet_active_worker_#{id}"
  end

  def default_cron
    '*/5 * * * *'
  end

  def must_has_triggers
    errors.add(:applet_triggers, ' must have') if applet_triggers.blank?
  end

  def must_has_actions
    errors.add(:applet_actions, ' must have') if applet_actions.blank?
  end

  def must_be_cron_format
    errors.add(:cron, ' wrong format') if cron_instance.blank?
  end
end
