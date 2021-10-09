import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  PandoLeafActionThemeColor,
  PandoLeafAppId,
  PandoLeafLogoUrl,
} from 'apps/ifttb/constants';
import { AppletTriggerInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import AppletPandoLeafTriggerBidingFlipFormComponent from './AppletPandoLeafTriggerBidingFlipFormComponent';

export default function AppletPandoLeafTriggerFormComponent(props: {
  visible: boolean;
  triggerType: 'AppletPandoLeafBidingFlipTrigger';
  onSelected?: (selected: 'AppletPandoLeafBidingFlipTrigger') => any;
  onCancel: () => any;
  onOk: (trigger: AppletTriggerInput) => any;
}) {
  const { visible, onCancel, triggerType, onSelected, onOk } = props;
  const PandoLeafTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: PandoLeafActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div
          className='relative p-4 text-xl font-bold bg-gray-50'
        >
          <CloseIcon
            onClick={onCancel}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Pando Leaf Trigger</div>
        </div>
        <div
          className='px-4 pt-4 pb-8 mb-4 bg-gray-50'
        >
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={PandoLeafLogoUrl} />
          </div>
          <div className='mb-2 text-base'>
            Run your applet when Pando Leaf Index(like new auction) match a
            target value.
          </div>
          <div className='text-base'>
            <a
              className='text-blue-500'
              href={`mixin://users/${PandoLeafAppId}`}
              target='_blank'
            >
              Pando Leaf
            </a>{' '}
            is a decentralized financial network, implement a derivatives
            liquidity protocol.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <PandoLeafTriggerItem
            onClick={() => onSelected('AppletPandoLeafBidingFlipTrigger')}
          >
            Ongoing auction
          </PandoLeafTriggerItem>
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
                AppletPandoLeafBidingFlipTrigger: (
                  <AppletPandoLeafTriggerBidingFlipFormComponent
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
