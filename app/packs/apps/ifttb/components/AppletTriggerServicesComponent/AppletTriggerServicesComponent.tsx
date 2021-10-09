import {
  AlarmClock as AlarmClockIcon,
  Down as DownIcon,
} from '@icon-park/react';
import {
  FoxSwapActionThemeColor,
  FoxSwapLogoUrl,
  PandoLeafLogoUrl,
  PandoRingsLogoUrl,
} from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';

export default function AppletTriggerServicesComponent(props: {
  visible: boolean;
  onCancel: () => any;
  onSelected: (
    selected:
      | 'AppletDatetimeTrigger'
      | 'Applet4swapTrigger'
      | 'AppletPandoLeafTrigger'
      | 'AppletPandoRingsTrigger',
  ) => any;
}) {
  const { visible, onCancel, onSelected } = props;
  const { appletForm } = useAppletForm();
  const appletDatetimeTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger: AppletTriggerInput) =>
        trigger.type === 'AppletDatetimeTrigger' && !trigger._destroy,
    );
  const applet4swapTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger: AppletTriggerInput) =>
        trigger.type === 'Applet4swapTrigger' && !trigger._destroy,
    );
  const appletPandoLeafTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger: AppletTriggerInput) =>
        trigger.type === 'AppletPandoLeafTrigger' && !trigger._destroy,
    );
  const appletPandoRingsTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger: AppletTriggerInput) =>
        trigger.type === 'AppletPandoRingsTrigger' && !trigger._destroy,
    );
  return (
    <Popup visible={visible} direction='bottom' onMaskClick={onCancel}>
      <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
        <div className='sticky flex justify-center p-2'>
          <DownIcon size='2rem' onClick={() => props.onCancel()} />
        </div>
        <div className='p-4 grid grid-cols-2 gap-2'>
          <div
            className={`p-4 text-white bg-gray-800 shadow rounded-lg ${
              appletDatetimeTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!appletDatetimeTriggerCreated()) {
                onSelected('AppletDatetimeTrigger');
              }
            }}
          >
            <div className='flex justify-center mb-2 text-lg'>
              <AlarmClockIcon size='1.75rem' />
            </div>
            <div className='text-lg text-center'>Datetime</div>
          </div>
          <div
            className={`p-4 rounded-lg shadow ${
              applet4swapTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            style={{ background: FoxSwapActionThemeColor }}
            onClick={() => {
              if (!applet4swapTriggerCreated()) {
                onSelected('Applet4swapTrigger');
              }
            }}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={FoxSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>4swap</div>
          </div>
          <div
            className={`p-4 rounded-lg bg-green-100 shadow ${
              appletPandoLeafTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!appletPandoLeafTriggerCreated()) {
                onSelected('AppletPandoLeafTrigger');
              }
            }}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={PandoLeafLogoUrl} />
            </div>
            <div className='text-lg text-center'>Pando Leaf</div>
          </div>
          <div
            className={`p-4 rounded-lg bg-yellow-100 shadow ${
              appletPandoRingsTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!appletPandoLeafTriggerCreated()) {
                onSelected('AppletPandoRingsTrigger');
              }
            }}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={PandoRingsLogoUrl} />
            </div>
            <div className='text-lg text-center'>Pando Rings</div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
