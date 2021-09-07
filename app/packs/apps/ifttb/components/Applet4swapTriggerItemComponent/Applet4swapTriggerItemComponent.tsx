import { FoxSwapActionThemeColor, FoxSwapLogoUrl } from 'apps/ifttb/constants';
import { Applet4swapTrigger } from 'graphqlTypes';
import React from 'react';

export default function Applet4swapTriggerItemComponent(props: {
  trigger: Partial<Applet4swapTrigger> | any;
  onClick?: () => any;
}) {
  const { trigger, onClick } = props;
  return (
    <div
      className='flex items-start p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
      style={{ background: FoxSwapActionThemeColor }}
      onClick={onClick}
    >
      <span className='text-xl'>If</span>
      <img className='rounded-full w-7 h-7' src={FoxSwapLogoUrl} />
      <span className='leading-7'>{trigger.params.description}</span>
    </div>
  );
}
