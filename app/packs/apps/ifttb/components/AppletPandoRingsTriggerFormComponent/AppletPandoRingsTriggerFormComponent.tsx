import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  PandoRingsActionThemeColor,
  PandoRingsAppId,
  PandoRingsLogoUrl,
} from 'apps/ifttb/constants';
import { AppletTriggerInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import AppletPandoRingsTriggerBorrowApyFormComponent from './AppletPandoRingsTriggerBorrowApyFormComponent';
import AppletPandoRingsTriggerBorrowVolumeFormComponent from './AppletPandoRingsTriggerBorrowVolumeFormComponent';
import AppletPandoRingsTriggerSupplyApyFormComponent from './AppletPandoRingsTriggerSupplyApyFormComponent';
import AppletPandoRingsTriggerSupplyVolumeFormComponent from './AppletPandoRingsTriggerSupplyVolumeFormComponent';

export default function AppletPandoRingsTriggerFormComponent(props: {
  visible: boolean;
  triggerType:
    | 'AppletPandoRingsSupplyApyTrigger'
    | 'AppletPandoRingsSupplyVolumeTrigger'
    | 'AppletPandoRingsBorrowApyTrigger'
    | 'AppletPandoRingsBorrowVolumeTrigger';
  onSelected?: (
    selected:
      | 'AppletPandoRingsSupplyApyTrigger'
      | 'AppletPandoRingsSupplyVolumeTrigger'
      | 'AppletPandoRingsBorrowApyTrigger'
      | 'AppletPandoRingsBorrowVolumeTrigger',
  ) => any;
  onCancel: () => any;
  onOk: (trigger: AppletTriggerInput) => any;
}) {
  const { visible, onCancel, triggerType, onSelected, onOk } = props;
  const PandoRingsTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: PandoRingsActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div className='relative p-4 text-xl font-bold bg-yellow-100'>
          <CloseIcon
            onClick={onCancel}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Pando Rings Trigger</div>
        </div>
        <div className='px-4 pt-4 pb-8 mb-4 bg-yellow-100'>
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={PandoRingsLogoUrl} />
          </div>
          <div className='mb-2 text-base'>
            Run your applet when Pando Rings Index(like supply APY) match a
            target value.
          </div>
          <div className='text-base'>
            <a
              className='text-blue-500'
              href={`mixin://users/${PandoRingsAppId}`}
              target='_blank'
            >
              Pando Rings
            </a>{' '}
            is fully decentralized protocol for automated liquidity provision.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <PandoRingsTriggerItem
            onClick={() => onSelected('AppletPandoRingsSupplyApyTrigger')}
          >
            Supply APY
          </PandoRingsTriggerItem>
          <PandoRingsTriggerItem
            onClick={() => onSelected('AppletPandoRingsSupplyVolumeTrigger')}
          >
            Supply Volume
          </PandoRingsTriggerItem>
          <PandoRingsTriggerItem
            onClick={() => onSelected('AppletPandoRingsBorrowApyTrigger')}
          >
            Borrow APY
          </PandoRingsTriggerItem>
          <PandoRingsTriggerItem
            onClick={() => onSelected('AppletPandoRingsBorrowVolumeTrigger')}
          >
            Borrow Volume
          </PandoRingsTriggerItem>
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
                AppletPandoRingsSupplyApyTrigger: (
                  <AppletPandoRingsTriggerSupplyApyFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletPandoRingsSupplyVolumeTrigger: (
                  <AppletPandoRingsTriggerSupplyVolumeFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletPandoRingsBorrowApyTrigger: (
                  <AppletPandoRingsTriggerBorrowApyFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletPandoRingsBorrowVolumeTrigger: (
                  <AppletPandoRingsTriggerBorrowVolumeFormComponent
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
