import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import EditingEveryDayTriggerComponent from './EditingEveryDayTriggerComponent';
import EditingEveryHourTriggerComponent from './EditingEveryHourTriggerComponent';
import EditingEveryMinuteTriggerComponent from './EditingEveryMinuteTriggerComponent';
import EditingEveryMonthTriggerComponent from './EditingEveryMonthTriggerComponent';
import EditingEveryWeekTriggerComponent from './EditingEveryWeekTriggerComponent';

export default function AppletDatetimeTriggerFormComponent(props: {
  onCancel: () => any;
  onFinish: (trigger) => any;
}) {
  const { onFinish, onCancel } = props;
  const [type, setType] = useState<
    | null
    | 'everyMinute'
    | 'everyHourAt'
    | 'everyDayAt'
    | 'everyWeekAt'
    | 'everyMonthAt'
  >(null);

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
    <>
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
        <DatetimeTriggerItem onClick={() => setType('everyMinute')}>
          Every Minute
        </DatetimeTriggerItem>
        <DatetimeTriggerItem onClick={() => setType('everyHourAt')}>
          Every Hour At
        </DatetimeTriggerItem>
        <DatetimeTriggerItem onClick={() => setType('everyDayAt')}>
          Every Day At
        </DatetimeTriggerItem>
        <DatetimeTriggerItem onClick={() => setType('everyWeekAt')}>
          Every Week At
        </DatetimeTriggerItem>
        <DatetimeTriggerItem onClick={() => setType('everyMonthAt')}>
          Every Month At
        </DatetimeTriggerItem>
      </div>
      <Popup visible={Boolean(type)} onMaskClick={() => setType(null)}>
        <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          {
            {
              everyMinute: (
                <EditingEveryMinuteTriggerComponent
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyHourAt: (
                <EditingEveryHourTriggerComponent
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyDayAt: (
                <EditingEveryDayTriggerComponent
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyWeekAt: (
                <EditingEveryWeekTriggerComponent
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyMonthAt: (
                <EditingEveryMonthTriggerComponent
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
