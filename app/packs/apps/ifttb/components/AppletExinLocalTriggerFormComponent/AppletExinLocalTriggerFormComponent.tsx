import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  ExinLocalActionThemeColor,
  ExinLocalAppId,
  ExinLocalLogoUrl,
} from 'apps/ifttb/constants';
import { AppletTriggerInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import AppletExinLocalTriggerPriceFormComponent from './AppletExinLocalTriggerPriceFormComponent';

export default function AppletExinLocalTriggerFormComponent(props: {
  visible: boolean;
  triggerType: 'AppletExinLocalPriceTrigger';
  onSelected?: (selected: 'AppletExinLocalPriceTrigger') => any;
  onCancel: () => any;
  onOk: (trigger: AppletTriggerInput) => any;
}) {
  const { visible, onCancel, triggerType, onSelected, onOk } = props;
  const ExinLocalTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: ExinLocalActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div
          className='relative p-4 text-xl font-bold'
          style={{ background: ExinLocalActionThemeColor }}
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
          style={{ background: ExinLocalActionThemeColor }}
        >
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={ExinLocalLogoUrl} />
          </div>
          <div className='mb-2 text-base'>
            Run your applet when ExinLocal Index(like price) match a target
            value.
          </div>
          <div className='text-base'>
            <a
              className='text-blue-500'
              href={`mixin://users/${ExinLocalAppId}`}
              target='_blank'
            >
              ExinLocal
            </a>{' '}
            is a worldwide peer-to-peer marketplace where buy and sell
            cryptocurrencies.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <ExinLocalTriggerItem
            onClick={() => onSelected('AppletExinLocalPriceTrigger')}
          >
            Price
          </ExinLocalTriggerItem>
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
                AppletExinLocalPriceTrigger: (
                  <AppletExinLocalTriggerPriceFormComponent
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
