import {
  Alarm as AlarmIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletActionInput } from 'graphqlTypes';
import React from 'react';
import { Popup } from 'zarm';
import AppletAlertMessengerActionFormComponent from './AppletAlertMessengerActionFormComponent';

export default function AppletAlertActionFormComponent(props: {
  visible: boolean;
  actionType: 'AppletAlertMessengerAction';
  onSelected?: (selected: 'AppletAlertMessengerAction') => any;
  onCancel: () => any;
  onOk: (action: AppletActionInput) => any;
}) {
  const { onCancel, onOk, visible, onSelected, actionType } = props;
  const { appletForm } = useAppletForm();
  const appletAlertAction = appletForm?.appletActionsAttributes?.find(
    (action) => action.type === 'AppletAlertAction',
  );

  const AlertTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 bg-blue-600 text-white mb-4 text-center rounded ${props.className}`}
    >
      {props.children}
    </div>
  );

  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div className='relative p-4 text-xl font-bold text-white bg-blue-600'>
          <CloseIcon
            onClick={onCancel}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Alert Action</div>
        </div>
        <div className='px-4 pt-4 pb-8 mb-4 text-white bg-blue-600'>
          <div className='flex justify-center mb-4'>
            <AlarmIcon size='3rem' />
          </div>
          <div className='text-sm'>Send alert message when triggers fire.</div>
        </div>
        <div className='p-4 bg-white'>
          <AlertTriggerItem
            onClick={() => onSelected('AppletAlertMessengerAction')}
          >
            via Mixin Messenger
          </AlertTriggerItem>
        </div>
        <Popup
          visible={Boolean(actionType)}
          onMaskClick={() => {
            if (Boolean(appletAlertAction?.id)) {
              onCancel();
            } else {
              onSelected(null);
            }
          }}
        >
          <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/3'>
            <div className='sticky flex justify-center p-2'>
              <DownIcon size='2rem' />
            </div>
            {
              {
                AppletAlertMessengerAction: (
                  <AppletAlertMessengerActionFormComponent
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
