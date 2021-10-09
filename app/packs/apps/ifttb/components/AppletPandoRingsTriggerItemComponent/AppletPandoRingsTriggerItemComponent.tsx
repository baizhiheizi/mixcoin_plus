import { PandoRingsLogoUrl } from 'apps/ifttb/constants';
import { AppletPandoLeafTrigger } from 'graphqlTypes';
import React from 'react';

export default function AppletPandoRingsTriggerItemComponent(props: {
  trigger: Partial<AppletPandoLeafTrigger> | any;
  onClick?: () => any;
}) {
  const { trigger, onClick } = props;
  return (
    <div
      className='flex items-start p-4 mb-8 text-lg font-bold bg-yellow-100 rounded-lg cursor-pointer space-x-2'
      onClick={onClick}
    >
      <span className='text-xl'>If</span>
      <img className='rounded-full w-7 h-7' src={PandoRingsLogoUrl} />
      <span className='leading-7'>{trigger.params.description}</span>
    </div>
  );
}
