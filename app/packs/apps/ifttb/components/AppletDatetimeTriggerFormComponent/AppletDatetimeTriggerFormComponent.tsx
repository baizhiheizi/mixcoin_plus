import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import React from 'react';
import { Popup } from 'zarm';
import AppletDatetimeTriggerDayFormComponent from './AppletDatetimeTriggerDayFormComponent';
import AppletDatetimeTriggerHourFormComponent from './AppletDatetimeTriggerHourFormComponent';
import AppletDatetimeTriggerMinuteFormComponent from './AppletDatetimeTriggerMinuteFormComponent';
import AppletDatetimeTriggerMonthFormComponent from './AppletDatetimeTriggerMonthFormComponent';
import AppletDatetimeTriggerWeekFormComponent from './AppletDatetimeTriggerWeekFormComponent';

export default function AppletDatetimeTriggerFormComponent(props: {
  visible: boolean;
  triggerType:
    | 'AppletDatetimeMinuteTrigger'
    | 'AppletDatetimeHourTrigger'
    | 'AppletDatetimeDayTrigger'
    | 'AppletDatetimeWeekTrigger'
    | 'AppletDatetimeMonthTrigger';
  onSelected?: (
    selected:
      | 'AppletDatetimeMinuteTrigger'
      | 'AppletDatetimeHourTrigger'
      | 'AppletDatetimeDayTrigger'
      | 'AppletDatetimeWeekTrigger'
      | 'AppletDatetimeMonthTrigger',
  ) => any;
  onCancel: () => any;
  onOk: (trigger) => any;
}) {
  const { onOk, onCancel, onSelected, visible, triggerType } = props;

  const DatetimeTriggerItem = (props: {
    children: JSX.Element | String;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className='p-4 mb-4 text-center text-white bg-gray-800 rounded'
    >
      {props.children}
    </div>
  );
  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className='h-screen overflow-y-scroll bg-white'>
        <div className='relative p-4 text-xl font-bold text-white bg-gray-800'>
          <CloseIcon
            onClick={onCancel}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Datetime Trigger</div>
        </div>
        <div className='px-4 pt-4 pb-8 mb-4 text-white bg-gray-800'>
          <div className='flex justify-center mb-4'>
            <AlarmClockIcon size='3rem' />
          </div>
          <div className='text-sm'>
            Set a datetime trigger to run your Applet on every miniute / hour /
            day / week / month.
          </div>
        </div>
        <div className='p-4 bg-white'>
          <DatetimeTriggerItem
            onClick={() => onSelected('AppletDatetimeMinuteTrigger')}
          >
            Every Minute
          </DatetimeTriggerItem>
          <DatetimeTriggerItem
            onClick={() => onSelected('AppletDatetimeHourTrigger')}
          >
            Every Hour At
          </DatetimeTriggerItem>
          <DatetimeTriggerItem
            onClick={() => onSelected('AppletDatetimeDayTrigger')}
          >
            Every Day At
          </DatetimeTriggerItem>
          <DatetimeTriggerItem
            onClick={() => onSelected('AppletDatetimeWeekTrigger')}
          >
            Every Week At
          </DatetimeTriggerItem>
          <DatetimeTriggerItem
            onClick={() => onSelected('AppletDatetimeMonthTrigger')}
          >
            Every Month At
          </DatetimeTriggerItem>
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
                AppletDatetimeMinuteTrigger: (
                  <AppletDatetimeTriggerMinuteFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletDatetimeHourTrigger: (
                  <AppletDatetimeTriggerHourFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletDatetimeDayTrigger: (
                  <AppletDatetimeTriggerDayFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletDatetimeWeekTrigger: (
                  <AppletDatetimeTriggerWeekFormComponent
                    onFinish={(trigger) => {
                      onOk(trigger);
                    }}
                  />
                ),
                AppletDatetimeMonthTrigger: (
                  <AppletDatetimeTriggerMonthFormComponent
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
