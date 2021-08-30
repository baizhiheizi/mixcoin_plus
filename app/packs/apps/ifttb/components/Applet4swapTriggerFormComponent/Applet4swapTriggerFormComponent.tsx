import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import { FSwapActionThemeColor, FSwapLogoUrl } from 'apps/ifttb/constants';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import Editing4swapPriceTriggerComponent from './Editing4swapPriceTriggerComponent';

export function Applet4swapTriggerFormComponent(props: {
  onCancel: () => any;
  onFinish: (trigger) => any;
}) {
  const { onCancel, onFinish } = props;
  const [type, setType] = useState<null | 'price'>(null);
  const FswapTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: FSwapActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <>
      <div
        className='relative p-4 text-xl font-bold'
        style={{ background: FSwapActionThemeColor }}
      >
        <CloseIcon
          onClick={onCancel}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create 4swap Trigger</div>
      </div>
      <div
        className='px-4 pt-4 pb-8 mb-4'
        style={{ background: FSwapActionThemeColor }}
      >
        <div className='flex justify-center mb-4'>
          <img className='w-12 h-12' src={FSwapLogoUrl} />
        </div>
        <div className='text-sm'>
          Run your applet when 4swap Index(like price) match a target value.
        </div>
      </div>
      <div className='p-4 bg-white'>
        <FswapTriggerItem onClick={() => setType('price')}>
          Price
        </FswapTriggerItem>
      </div>
      <Popup visible={Boolean(type)} onMaskClick={() => setType(null)}>
        <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          {
            {
              price: (
                <Editing4swapPriceTriggerComponent
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
            }[type]
          }
        </div>
      </Popup>
    </>
  );
}
