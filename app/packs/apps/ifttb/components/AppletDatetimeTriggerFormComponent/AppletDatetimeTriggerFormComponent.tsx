import { Down as DownIcon } from '@icon-park/react';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

export default function AppletDatetimeTriggerForm(props: {
  onFinish?: (params: { tigger?: any }) => any;
}) {
  const { onFinish } = props;
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
                <EditingEveryMinuteTrigger onFinish={() => setType(null)} />
              ),
            }[type]
          }
        </div>
      </Popup>
    </>
  );
}

function EditingEveryMinuteTrigger(props: { onFinish: () => any }) {
  const history = useHistory();
  const { appletForm, setAppletForm } = useAppletForm();
  const createTrigger = () => {
    const trigger = {
      description: 'once every miniute',
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      wday: '*',
    };
    setAppletForm({
      ...appletForm,
      appletDatetimeTrigger: trigger,
    });
    props.onFinish();
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
