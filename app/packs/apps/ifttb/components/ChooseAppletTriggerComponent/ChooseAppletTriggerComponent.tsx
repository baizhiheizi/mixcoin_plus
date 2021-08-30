import {
  AlarmClock as AlarmClockIcon,
  Down as DownIcon,
} from '@icon-park/react';
import AppletDatetimeTriggerFormComponent from 'apps/ifttb/components/AppletDatetimeTriggerFormComponent/AppletDatetimeTriggerFormComponent';
import { FSwapActionThemeColor, FSwapLogoUrl } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import { Applet4swapTriggerFormComponent } from '../Applet4swapTriggerFormComponent/Applet4swapTriggerFormComponent';

export function ChooseAppletTriggerComponent(props: {
  onOk?: () => any;
  onCancel?: () => any;
}) {
  const [tiggerType, setTriggerType] = useState<null | 'datetime' | '4swap'>(
    null,
  );
  const { appletForm, setAppletForm } = useAppletForm();
  return (
    <>
      <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
        <div className='sticky flex justify-center p-2'>
          <DownIcon size='2rem' onClick={() => props.onCancel()} />
        </div>
        <div className='p-4 grid grid-cols-2 gap-2'>
          <div
            className={`p-4 text-white bg-gray-800 rounded-lg ${
              appletForm?.appletDatetimeTrigger
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (!appletForm?.appletDatetimeTrigger) {
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
              appletForm?.applet4swapTrigger
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            style={{ background: FSwapActionThemeColor }}
            onClick={() => {
              if (!appletForm?.applet4swapTrigger) {
                setTriggerType('4swap');
              }
            }}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={FSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>4swap</div>
          </div>
        </div>
      </div>
      <Popup
        visible={Boolean(tiggerType)}
        direction='bottom'
        onMaskClick={() => setTriggerType(null)}
      >
        <div className='h-screen bg-white'>
          {
            {
              datetime: (
                <AppletDatetimeTriggerFormComponent
                  onCancel={() => setTriggerType(null)}
                  onFinish={(trigger) => {
                    console.log(trigger);
                    setAppletForm({
                      ...appletForm,
                      appletDatetimeTrigger: trigger,
                    });
                    setTriggerType(null);
                    props.onOk();
                  }}
                />
              ),
              '4swap': (
                <Applet4swapTriggerFormComponent
                  onCancel={() => setTriggerType(null)}
                  onFinish={(trigger) => {
                    console.log(trigger);
                    setAppletForm({
                      ...appletForm,
                      applet4swapTrigger: trigger,
                    });
                    setTriggerType(null);
                    props.onOk();
                  }}
                />
              ),
            }[tiggerType]
          }
        </div>
      </Popup>
    </>
  );
}
