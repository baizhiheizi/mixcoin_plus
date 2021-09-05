# frozen_string_literal: true

module Users::Ifttbable
  extend ActiveSupport::Concern

  included do
    has_one :ifttb_broker, as: :owner, dependent: :restrict_with_exception
    has_one :ifttb_profile, class_name: 'UserIfttbProfile', dependent: :restrict_with_exception

    after_create :create_ifttb_profile
  end

  def ifttb_role
    ifttb_profile.role
  end

  def ifttb_upgrade_pro(period = 1.year)
    ifttb_profile.upgrade_pro(period)
  end

  def ifttb_expire_pro
    ifttb_profile.expire_pro
  end

  def ifttb_free?
    ifttb_profile.free?
  end

  def ifttb_pro?
    ifttb_profile.pro?
  end

  def may_create_applet?
    ifttb_pro? || applets.without_archived.count < 3
  end
end
