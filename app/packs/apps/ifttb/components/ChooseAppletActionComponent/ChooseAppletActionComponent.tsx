import { Down as DownIcon } from '@icon-park/react';
import { FSwapActionThemeColor, FSwapLogoUrl } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import { Applet4swapActionFormComponent } from '../Applet4swapActionFormComponent/Applet4swapActionFormComponent';

export function ChooseAppletActionComponent(props: {
  onCancel?: () => any;
  onOk?: () => any;
}) {
  const [actionType, setActionType] = useState<null | '4swap'>(null);
  const { appletForm, setAppletForm } = useAppletForm();
  return (
    <>
      <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
        <div className='sticky flex justify-center p-2'>
          <DownIcon size='2rem' />
        </div>
        <div className='p-4 grid grid-cols-2 gap-2'>
          <div
            className='p-4 rounded-lg'
            style={{ background: FSwapActionThemeColor }}
            onClick={() => setActionType('4swap')}
          >
            <div className='flex justify-center mb-2'>
              <img className='w-7 h-7' src={FSwapLogoUrl} />
            </div>
            <div className='text-lg text-center'>4Swap</div>
          </div>
        </div>
      </div>
      <Popup
        visible={Boolean(actionType)}
        direction='bottom'
        onMaskClick={() => setActionType(null)}
      >
        <div className='h-screen bg-white'>
          {
            {
              '4swap': (
                <Applet4swapActionFormComponent
                  onCancel={() => setActionType(null)}
                  onFinish={(action) => {
                    console.log(action);
                    setAppletForm({
                      ...appletForm,
                      applet4swapAction: action,
                    });
                    setActionType(null);
                    props.onOk();
                  }}
                />
              ),
            }[actionType]
          }
        </div>
      </Popup>
    </>
  );
}
