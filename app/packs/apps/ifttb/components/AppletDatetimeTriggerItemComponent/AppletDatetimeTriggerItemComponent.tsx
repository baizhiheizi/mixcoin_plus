import { AlarmClock as AlarmClockIcon } from '@icon-park/react';
import { AppletDatetimeTrigger } from 'graphqlTypes';
import React from 'react';

export default function AppletDatetimeTriggerItemComponent(props: {
  trigger: Partial<AppletDatetimeTrigger> | any;
  onClick?: () => any;
}) {
  const { trigger, onClick } = props;
  return (
    <div
      className='flex items-start p-4 mb-8 text-lg font-bold text-white bg-gray-800 rounded-lg cursor-pointer space-x-2'
      onClick={onClick}
    >
      <span className='text-xl'>If</span>
      <span>
        <AlarmClockIcon size='1.75rem' />
      </span>
      <span className='leading-7'>{trigger.params.description}</span>
    </div>
  );
}
