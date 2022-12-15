# frozen_string_literal: true

module Ifttb::AppletsHelper
  def applet_trigger_icon(trigger, **kargs)
    case trigger
    when AppletDatetimeTrigger
      inline_svg_tag 'icons/clock.svg', **kargs
    when Applet4swapTrigger
      image_tag '4swap.png', **kargs
    when AppletPandoLeafTrigger
      image_tag 'pando-leaf.svg', **kargs
    when AppletPandoRingsTrigger
      image_tag 'pando-rings.svg', **kargs
    when AppletExinLocalTrigger
      image_tag 'tiga.png', **kargs
    end
  end

  def applet_action_icon(action, **kargs)
    case action
    when Applet4swapAction
      image_tag '4swap.png', **kargs
    when AppletMixSwapAction
      image_tag 'mixswap.png', **kargs
    when AppletAlertAction
      inline_svg_tag 'icons/bell-alert.svg', **kargs
    end
  end
end
