import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  FoxSwapActionThemeColor,
  FoxSwapAppId,
  FoxSwapLogoUrl,
} from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletActionInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import Applet4swapActionTradeFormComponent from './Applet4swapActionTradeFormComponent';

export default function Applet4swapActionFormComponent(props: {
  visible: boolean;
  actionType: 'Applet4swapTradeAction';
  onSelected?: (selected: 'Applet4swapTradeAction') => any;
  onCancel: () => any;
  onOk: (action: AppletActionInput) => any;
}) {
  const { visible, onCancel, onOk, actionType, onSelected } = props;
  const { appletForm } = useAppletForm();
  const applet4swapAction = appletForm?.appletActionsAttributes?.find(
    (action) => action.type === 'Applet4swapAction',
  );

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
          <div className='text-center'>Create 4swap Action</div>
        </div>
        <div
          className='px-4 pt-4 pb-8 mb-4'
          style={{ background: FoxSwapActionThemeColor }}
        >
          <div className='flex justify-center mb-4'>
            <img className='w-12 h-12' src={FoxSwapLogoUrl} />
          </div>
          <div className='mb-2 text-base'>
            Use 4swap to swap asset or add / remove liquidity.
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
            onClick={() => onSelected('Applet4swapTradeAction')}
          >
            Trade
          </FswapTriggerItem>
          <FswapTriggerItem className='opacity-50'>
            Add liquidity
          </FswapTriggerItem>
          <FswapTriggerItem className='opacity-50'>
            Remove liquidity
          </FswapTriggerItem>
        </div>
        <Popup
          visible={Boolean(actionType)}
          onMaskClick={() => {
            if (Boolean(applet4swapAction.id)) {
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
                Applet4swapTradeAction: (
                  <Applet4swapActionTradeFormComponent
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
