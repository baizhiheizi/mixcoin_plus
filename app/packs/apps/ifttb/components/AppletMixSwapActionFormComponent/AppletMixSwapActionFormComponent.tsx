import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  MixSwapActionThemeColor,
  MixSwapAppId,
  MixSwapLogoUrl,
} from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletActionInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import AppletMixSwapActionTradeFormComponent from './AppletMixSwapActionTradeFormComponent';

export default function AppletMixSwapActionFormComponent(props: {
  visible: boolean;
  actionType: 'AppletMixSwapTradeAction';
  onSelected?: (selected: 'AppletMixSwapTradeAction') => any;
  onCancel: () => any;
  onOk: (action: AppletActionInput) => any;
}) {
  const { onCancel, onOk, visible, onSelected, actionType } = props;
  const { appletForm } = useAppletForm();
  const appletMixSwapAction = appletForm?.appletActionsAttributes?.find(
    (action) => action.type === 'AppletMixSwapAction',
  );

  const MixSwapTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: MixSwapActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div
          className='relative p-4 text-xl font-bold'
          style={{ background: MixSwapActionThemeColor }}
        >
          <CloseIcon
            onClick={onCancel}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>MixSwap Action</div>
        </div>
        <div
          className='px-4 pt-4 pb-8 mb-4'
          style={{ background: MixSwapActionThemeColor }}
        >
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={MixSwapLogoUrl} />
          </div>
          <div className='mb-2 text-base'>Use MixSwap to swap asset.</div>
          <div className='text-base'>
            <a className='text-white' href={`mixin://users/${MixSwapAppId}`}>
              MixSwap
            </a>{' '}
            is the MiFi DEX aggregation trading platform of Exin.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <MixSwapTriggerItem
            onClick={() => onSelected('AppletMixSwapTradeAction')}
          >
            Swap
          </MixSwapTriggerItem>
        </div>
        <Popup
          visible={Boolean(actionType)}
          onMaskClick={() => {
            if (Boolean(appletMixSwapAction?.id)) {
              onCancel();
            } else {
              onSelected(null);
            }
          }}
        >
          <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
            <div className='sticky flex justify-center p-2'>
              <DownIcon size='2rem' />
            </div>
            {
              {
                AppletMixSwapTradeAction: (
                  <AppletMixSwapActionTradeFormComponent
                    onFinish={(action) => {
                      onOk(action);
                    }}
                  />
                ),
              }[actionType]
            }
          </div>
        </Popup>
      </div>
    </Popup>
  );
}
