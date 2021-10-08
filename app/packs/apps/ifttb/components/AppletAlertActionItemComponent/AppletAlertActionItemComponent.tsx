import { Alarm as AlarmIcon } from '@icon-park/react';
import { Applet4swapAction } from 'graphqlTypes';
import React from 'react';

export default function AppletAlertActionItemComponent(props: {
  action: Partial<Applet4swapAction> | any;
  onClick?: () => any;
}) {
  const { action, onClick } = props;
  return (
    <div
      className='flex items-start p-4 mb-8 text-lg font-bold text-white bg-blue-600 rounded-lg cursor-pointer space-x-2'
      onClick={onClick}
    >
      <span className='text-xl'>Then</span>
      <span>
        <AlarmIcon size='1.75rem' />
      </span>
      <span className='leading-7'>{action.params.description}</span>
    </div>
  );
}
