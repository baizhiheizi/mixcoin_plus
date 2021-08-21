import {
  AlarmClock as AlarmClockIcon,
  Down as DownIcon,
  Left as LeftIcon,
} from '@icon-park/react';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Popup } from 'zarm';

export default function NewTriggerPage() {
  const history = useHistory();
  const { type } = useParams<{ type: string }>();

  return (
    <>
      <div className='relative p-4 text-xl font-bold text-white bg-dark'>
        <LeftIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Datetime Trigger</div>
      </div>
      <div className='px-4 pt-4 pb-8 mb-4 text-white bg-dark'>
        <div className='flex justify-center mb-4'>
          <AlarmClockIcon size='3rem' />
        </div>
        <div className='text-sm'>
          Set a datetime trigger to run your Applet on every miniute / hour /
          day / week / month.
        </div>
      </div>
      {{ datetime: <NewDatetimeTriggerComponent /> }[type]}
    </>
  );
}

function NewDatetimeTriggerComponent() {
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
      className='p-4 mb-4 text-center text-white rounded bg-dark'
    >
      {props.children}
    </div>
  );
  return (
    <>
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
                <EditingEveryMinuteTrigger onClose={() => setType(null)} />
              ),
            }[type]
          }
        </div>
      </Popup>
    </>
  );
}

function EditingEveryMinuteTrigger(props: { onClose: () => any }) {
  const history = useHistory();
  const { appletForm, setAppletForm } = useAppletForm();
  const createTrigger = () => {
    const trigger = {
      type: 'AppletDatetimeTrigger',
      miniute: '*',
      hour: '*',
      day: '*',
      week: '*',
      wday: '*',
    };
    setAppletForm({
      ...appletForm,
      title: 'Run once every minute',
      appletDatetimeTrigger: trigger,
    });
    props.onClose();
    history.replace('/new');
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>Run your applet once every miniute</div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}
