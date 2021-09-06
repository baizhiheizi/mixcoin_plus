import { FoxSwapActionThemeColor, FoxSwapLogoUrl } from 'apps/ifttb/constants';
import { Applet4swapAction } from 'graphqlTypes';
import React from 'react';

export default function Applet4swapActionItemComponent(props: {
  action: Partial<Applet4swapAction> | any;
  onClick?: () => any;
}) {
  const { action, onClick } = props;
  return (
    <div
      className='flex items-start p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
      style={{ background: FoxSwapActionThemeColor }}
      onClick={onClick}
    >
      <span className='text-xl'>Then</span>
      <img className='rounded-full w-7 h-7' src={FoxSwapLogoUrl} />
      <span className='leading-7'>{action.description}</span>
    </div>
  );
}
