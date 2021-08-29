import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import moment from 'moment';
import React, { useState } from 'react';
import { Popup, Picker } from 'zarm';

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
      className='p-4 mb-4 text-center text-white rounded bg-dark'
    >
      {props.children}
    </div>
  );
  return (
    <>
      <div className='relative p-4 text-xl font-bold text-white bg-dark'>
        <CloseIcon
          onClick={onCancel}
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
                <EditingEveryMinuteTrigger
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyHourAt: (
                <EditingEveryHourTrigger
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyDayAt: (
                <EditingEveryDayTrigger
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyWeekAt: (
                <EditingEveryWeekTrigger
                  onFinish={(trigger) => {
                    onFinish(trigger);
                    setType(null);
                  }}
                />
              ),
              everyMonthAt: (
                <EditingEveryMonthTrigger
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

function EditingEveryMinuteTrigger(props: { onFinish: (trigger) => any }) {
  const [minute, setMinute] = useState<'1' | '5' | '10' | '15' | '30'>('1');
  const [choosingMinute, setChoosingMinute] = useState(false);
  const createTrigger = () => {
    const trigger = {
      description: `once every ${minute} miniutes`,
      minute: minute === '1' ? '*' : `*/${minute}`,
      hour: '*',
      day: '*',
      month: '*',
      wday: '*',
    };
    props.onFinish(trigger);
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet once</div>
        <div
          className='flex items-center justify-center space-x-4'
          onClick={() => setChoosingMinute(true)}
        >
          <span>every</span>
          <span className='font-bold'>{minute}</span>
          <span>minute</span>
        </div>
        <Picker
          visible={choosingMinute}
          value={minute}
          dataSource={[
            { value: '1', label: '1' },
            { value: '5', label: '5' },
            { value: '10', label: '10' },
            { value: '15', label: '15' },
            { value: '30', label: '30' },
          ]}
          onOk={(selected: any) => {
            console.log(selected);
            setMinute(selected[0].value);
            setChoosingMinute(false);
          }}
          onCancel={() => setChoosingMinute(false)}
          itemRender={(data) => data.label}
        />
      </div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}

function EditingEveryHourTrigger(props: { onFinish: (trigger) => any }) {
  const [minute, setMinute] = useState<number>(0);
  const [choosingMinute, setChoosingMinute] = useState(false);
  const options = [];
  for (let step = 0; step < 59; step++) {
    options.push({
      value: step,
      label: step.toString(),
    });
  }
  const createTrigger = () => {
    const trigger = {
      description: `once every hour at miniute ${minute}`,
      minute,
      hour: '*',
      day: '*',
      month: '*',
      wday: '*',
    };
    props.onFinish(trigger);
  };
  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet once every hour at</div>
        <div
          className='flex items-center justify-center space-x-4'
          onClick={() => setChoosingMinute(true)}
        >
          <span>minute</span>
          <span className='font-bold'>{minute}</span>
        </div>
        <Picker
          visible={choosingMinute}
          value={minute}
          dataSource={options}
          onOk={(selected: any) => {
            console.log(selected);
            setMinute(selected[0].value);
            setChoosingMinute(false);
          }}
          onCancel={() => setChoosingMinute(false)}
          itemRender={(data) => data.label}
        />
      </div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}

function EditingEveryDayTrigger(props: { onFinish: (trigger) => any }) {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [choosingMinute, setChoosingMinute] = useState(false);
  const [choosingHour, setChoosingHour] = useState(false);
  const minutes = [];
  for (let step = 0; step < 60; step++) {
    minutes.push({
      value: step,
      label: step.toString(),
    });
  }
  const hours = [];
  for (let step = 0; step < 24; step++) {
    hours.push({
      value: step,
      label: step.toString(),
    });
  }
  const createTrigger = () => {
    const trigger = {
      description: `once every day at ${hour < 10 ? `0${hour}` : hour}:${
        minute < 10 ? `0${minute}` : minute
      }`,
      minute,
      hour,
      day: '*',
      month: '*',
      wday: '*',
    };
    props.onFinish(trigger);
  };
  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet once every day at</div>
        <div className='flex items-center justify-center font-bold space-x-4'>
          <span onClick={() => setChoosingHour(true)}>
            {hour < 10 ? `0${hour}` : hour}
          </span>
          <span>:</span>
          <span onClick={() => setChoosingMinute(true)}>
            {minute < 10 ? `0${minute}` : minute}
          </span>
        </div>
        <Picker
          visible={choosingMinute}
          value={minute}
          dataSource={minutes}
          onOk={(selected: any) => {
            setMinute(selected[0].value);
            setChoosingMinute(false);
          }}
          onCancel={() => setChoosingMinute(false)}
          itemRender={(data) => data.label}
        />
        <Picker
          visible={choosingHour}
          value={hour}
          dataSource={hours}
          onOk={(selected: any) => {
            setHour(selected[0].value);
            setChoosingHour(false);
          }}
          onCancel={() => setChoosingHour(false)}
          itemRender={(data) => data.label}
        />
      </div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}

function EditingEveryWeekTrigger(props: { onFinish: (trigger) => any }) {
  const [wday, setDay] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [choosingMinute, setChoosingMinute] = useState(false);
  const [choosingHour, setChoosingHour] = useState(false);
  const [choosingWday, setChoosingWday] = useState(false);
  const minutes = [];
  for (let step = 0; step < 60; step++) {
    minutes.push({
      value: step,
      label: step.toString(),
    });
  }
  const hours = [];
  for (let step = 0; step < 24; step++) {
    hours.push({
      value: step,
      label: step.toString(),
    });
  }
  const weekdays = moment.weekdays();
  const wdays = [];
  for (let step = 0; step < 7; step++) {
    wdays.push({
      value: step,
      label: weekdays[step],
    });
  }
  const createTrigger = () => {
    const trigger = {
      description: `once every week at ${weekdays[wday]} ${
        hour < 10 ? `0${hour}` : hour
      }:${minute < 10 ? `0${minute}` : minute}`,
      minute,
      hour,
      day: '*',
      month: '*',
      wday: wday,
    };
    props.onFinish(trigger);
  };
  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet once every week at</div>
        <div className='flex items-center justify-center font-bold space-x-4'>
          <span onClick={() => setChoosingWday(true)}>{weekdays[wday]}</span>
          <span onClick={() => setChoosingHour(true)}>
            {hour < 10 ? `0${hour}` : hour}
          </span>
          <span>:</span>
          <span onClick={() => setChoosingMinute(true)}>
            {minute < 10 ? `0${minute}` : minute}
          </span>
        </div>
        <Picker
          visible={choosingMinute}
          value={minute}
          dataSource={minutes}
          onOk={(selected: any) => {
            setMinute(selected[0].value);
            setChoosingMinute(false);
          }}
          onCancel={() => setChoosingMinute(false)}
          itemRender={(data) => data.label}
        />
        <Picker
          visible={choosingHour}
          value={hour}
          dataSource={hours}
          onOk={(selected: any) => {
            setHour(selected[0].value);
            setChoosingHour(false);
          }}
          onCancel={() => setChoosingHour(false)}
          itemRender={(data) => data.label}
        />
        <Picker
          visible={choosingWday}
          value={wday}
          dataSource={wdays}
          onOk={(selected: any) => {
            setDay(selected[0].value);
            setChoosingWday(false);
          }}
          onCancel={() => setChoosingWday(false)}
          itemRender={(data) => data.label}
        />
      </div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}

function EditingEveryMonthTrigger(props: { onFinish: (trigger) => any }) {
  const [day, setDay] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [choosingMinute, setChoosingMinute] = useState(false);
  const [choosingHour, setChoosingHour] = useState(false);
  const [choosingDay, setChoosingDay] = useState(false);
  const minutes = [];
  for (let step = 0; step < 60; step++) {
    minutes.push({
      value: step,
      label: step.toString(),
    });
  }
  const hours = [];
  for (let step = 0; step < 24; step++) {
    hours.push({
      value: step,
      label: step.toString(),
    });
  }
  const days = [];
  for (let step = 0; step < 31; step++) {
    days.push({
      value: step,
      label: step.toString(),
    });
  }
  const createTrigger = () => {
    const trigger = {
      description: `once at ${hour < 10 ? `0${hour}` : hour}:${
        minute < 10 ? `0${minute}` : minute
      } on day-of-month ${day}`,
      minute,
      hour,
      day,
      month: '*',
      wday: '*',
    };
    props.onFinish(trigger);
  };
  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet once every month at</div>
        <div className='flex items-center justify-center mb-4 font-bold space-x-4'>
          <span onClick={() => setChoosingHour(true)}>
            {hour < 10 ? `0${hour}` : hour}
          </span>
          <span>:</span>
          <span onClick={() => setChoosingMinute(true)}>
            {minute < 10 ? `0${minute}` : minute}
          </span>
        </div>
        <div className='mb-4'>on day-of-month</div>
        <div className='flex justify-center font-bold space-x-4'>
          <span onClick={() => setChoosingDay(true)}>{day}</span>
        </div>
        <Picker
          visible={choosingMinute}
          value={minute}
          dataSource={minutes}
          onOk={(selected: any) => {
            setMinute(selected[0].value);
            setChoosingMinute(false);
          }}
          onCancel={() => setChoosingMinute(false)}
          itemRender={(data) => data.label}
        />
        <Picker
          visible={choosingHour}
          value={hour}
          dataSource={hours}
          onOk={(selected: any) => {
            setHour(selected[0].value);
            setChoosingHour(false);
          }}
          onCancel={() => setChoosingHour(false)}
          itemRender={(data) => data.label}
        />
        <Picker
          visible={choosingDay}
          value={day}
          dataSource={days}
          onOk={(selected: any) => {
            setDay(selected[0].value);
            setChoosingDay(false);
          }}
          onCancel={() => setChoosingDay(false)}
          itemRender={(data) => data.label}
        />
      </div>
      <div
        className='w-full p-4 text-xl text-center text-white rounded-full cursor-pointer bg-dark'
        onClick={() => createTrigger()}
      >
        Create Trigger
      </div>
    </div>
  );
}
