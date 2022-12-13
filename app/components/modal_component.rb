# frozen_string_literal: true

class ModalComponent < ViewComponent::Base
  renders_one :header

  def initialize(title: '', backdrop: 'default', classes: '')
    super

    @title = title
    @backdrop = backdrop
    @classes = classes
  end
end
