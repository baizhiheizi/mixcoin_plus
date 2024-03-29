import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  FoxSwapActionThemeColor,
  FoxSwapAppId,
  FoxSwapLogoUrl,
} from 'apps/ifttb/constants';
import { AppletTriggerInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import Applet4swapTriggerPriceFormComponent from './Applet4swapTriggerPriceFormComponent';

export default function Applet4swapTriggerFormComponent(props: {
  visible: boolean;
  triggerType: 'Applet4swapPriceTrigger';
  onSelected?: (selected: 'Applet4swapPriceTrigger') => any;
  onCancel: () => any;
  onOk: (trigger: AppletTriggerInput) => any;
}) {
  const { visible, onCancel, triggerType, onSelected, onOk } = props;
  const FswapTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: FoxSwapActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div
          className='relative p-4 text-xl font-bold'
          style={{ background: FoxSwapActionThemeColor }}
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
          style={{ background: FoxSwapActionThemeColor }}
        >
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={FoxSwapLogoUrl} />
          </div>
          <div className='mb-2 text-base'>
            Run your applet when 4swap Index(like price) match a target value.
          </div>
          <div className='text-base'>
            <a
              className='text-blue-500'
              href={`mixin://users/${FoxSwapAppId}`}
              target='_blank'
            >
              4swap
            </a>{' '}
            is a decentralized protocal implement for automated liquidity
            provision on Mixin Network.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <FswapTriggerItem
            onClick={() => onSelected('Applet4swapPriceTrigger')}
          >
            Price
          </FswapTriggerItem>
        </div>
        <Popup
          visible={Boolean(triggerType)}
          onMaskClick={() => onSelected(null)}
        >
          <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
            <div className='sticky flex justify-center p-2'>
              <DownIcon size='2rem' />
            </div>
            {
              {
                Applet4swapPriceTrigger: (
                  <Applet4swapTriggerPriceFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
              }[triggerType]
            }
          </div>
        </Popup>
      </div>
    </Popup>
  );
}
