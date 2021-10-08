import { Alarm as AlarmIcon, Down as DownIcon } from '@icon-park/react';
import {
  FoxSwapActionThemeColor,
  FoxSwapLogoUrl,
  MixSwapActionThemeColor,
  MixSwapLogoUrl,
} from 'apps/ifttb/constants';
import React from 'react';
import { Popup } from 'zarm';

export default function AppletActionServicesComponent(props: {
  visible: boolean;
  onCancel: () => any;
  onSelected: (
    selected: 'Applet4swapAction' | 'AppletMixSwapAction' | 'AppletAlertAction',
  ) => any;
}) {
  const { visible, onCancel, onSelected } = props;
  return (
    <Popup visible={visible} direction='bottom' onMaskClick={onCancel}>
      <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
        <div className='sticky flex justify-center p-2'>
          <DownIcon size='2rem' />
        </div>
        <div className='p-4 grid grid-cols-2 gap-2'>
          <div
            className='p-4 rounded-lg'
            style={{ background: FoxSwapActionThemeColor }}
            onClick={() => onSelected('Applet4swapAction')}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={FoxSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>4Swap</div>
          </div>
          <div
            className='p-4 rounded-lg'
            style={{ background: MixSwapActionThemeColor }}
            onClick={() => onSelected('AppletMixSwapAction')}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={MixSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>MixSwap</div>
          </div>
          <div
            className='p-4 text-white bg-blue-600 rounded-lg'
            onClick={() => onSelected('AppletAlertAction')}
          >
            <div className='flex justify-center mb-2 text-lg'>
              <AlarmIcon size='1.75rem' />
            </div>
            <div className='text-lg text-center'>Alert</div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
