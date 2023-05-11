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
#  state                   :string
#  title                   :string
#  type                    :string
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

  scope :within_24h, -> { where(created_at: (24.hours.ago)...) }
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
    notify_connected
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

  def notify_connected
    AppletConnectedNotification.with(applet: self).deliver(user)
  end

  def number
    id.split('-').second.upcase
  end

  def download_traded_swap_orders_async
    AppletDownloadTradedSwapOrdersWorker.perform_async id
  end

  def download_traded_swap_orders
    return if traded_swap_orders.blank?
    return if Rails.cache.read("applet_download_traded_swap_orders_lock_#{id}")

    send_traded_orders_csv_file_via_mixin
  end

  def send_traded_orders_csv_file_via_mixin
    return if traded_swap_orders.blank?

    Rails.cache.write "applet_download_traded_swap_orders_lock_#{id}", true, expires_in: 30.minutes

    file_name = "Applet-#{id}.csv"
    file = Tempfile.new file_name
    file_path = file.path
    file.close

    CSV.open(file_path, 'wb') do |csv|
      csv << %w[trace source state pay_asset pay_amount pay_amount_usd fill_asset fill_amount refund_amount created_at]
      traded_swap_orders.order(created_at: :asc).each do |order|
        csv << [
          order.trace_id,
          (order.is_a?(AppletActivityMixSwapOrder) ? 'MixSwap' : '4swap'),
          order.state,
          order.pay_asset.symbol,
          order.pay_amount.to_f,
          order.pay_amount_usd.to_f,
          order.fill_asset.symbol,
          order.fill_amount.to_f,
          order.refund_amount,
          created_at
        ]
      end
    end

    attachment = IfttbBot.api.upload_attachment(File.open(file_path))
    IfttbBot.api.send_file_message(
      conversation_id: IfttbBot.api.unique_uuid(user.mixin_uuid),
      data: {
        attachment_id: attachment['attachment_id'],
        mime_type: 'text/csv',
        size: file.size,
        name: file_name
      }
    )
  ensure
    file&.unlink
    Rails.cache.delete "applet_download_traded_swap_orders_lock_#{id}"
  end

  def traded_swap_orders
    @traded_swap_orders ||= swap_orders.where(state: %i[traded])
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
