import {
  AlarmClock as AlarmClockIcon,
  Down as DownIcon,
} from '@icon-park/react';
import { FoxSwapActionThemeColor, FoxSwapLogoUrl } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import EditingAppletTriggerComponent from '../EditingAppletTriggerComponent/EditingAppletTriggerComponent';

export default function ChooseAppletTriggerComponent(props: {
  onOk?: () => any;
  visible: boolean;
  onCancel?: () => any;
}) {
  const { visible, onOk, onCancel } = props;
  const [trigger, setTriggerType] = useState<null | 'datetime' | '4swap'>(null);
  const { appletForm } = useAppletForm();
  const appletDatetimeTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger) =>
        trigger.type === 'AppletDatetimeTrigger' && !trigger._destroy,
    );
  const applet4swapTriggerCreated = () =>
    (appletForm?.appletTriggersAttributes || []).find(
      (trigger) => trigger.type === 'Applet4swapTrigger' && !trigger._destroy,
    );
  return (
    <Popup visible={visible} direction='bottom' onMaskClick={onCancel}>
      <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
        <div className='sticky flex justify-center p-2'>
          <DownIcon size='2rem' onClick={() => props.onCancel()} />
        </div>
        <div className='p-4 grid grid-cols-2 gap-2'>
          <div
            className={`p-4 text-white bg-gray-800 rounded-lg ${
              appletDatetimeTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!appletDatetimeTriggerCreated()) {
                setTriggerType('datetime');
              }
            }}
          >
            <div className='flex justify-center mb-2 text-lg'>
              <AlarmClockIcon size='1.75rem' />
            </div>
            <div className='text-lg text-center'>Datetime</div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              applet4swapTriggerCreated()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            style={{ background: FoxSwapActionThemeColor }}
            onClick={() => {
              if (!applet4swapTriggerCreated()) {
                setTriggerType('4swap');
              }
            }}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={FoxSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>4swap</div>
          </div>
        </div>
      </div>
      <EditingAppletTriggerComponent
        triggerType={trigger}
        onOk={() => {
          setTriggerType(null);
          onOk();
        }}
        onCancel={() => {
          setTriggerType(null);
          onCancel();
        }}
      />
    </Popup>
  );
}
