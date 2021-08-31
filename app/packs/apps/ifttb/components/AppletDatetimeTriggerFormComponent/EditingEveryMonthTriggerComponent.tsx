import React, { useState } from 'react';
import { Picker } from 'zarm';

export default function EditingEveryMonthTriggerComponent(props: {
  onFinish: (trigger) => any;
}) {
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
  for (let step = 1; step < 31; step++) {
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
      minute: minute.toString(),
      hour: hour.toString(),
      day: day.toString(),
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
