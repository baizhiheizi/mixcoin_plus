import { AppletTriggerInput } from 'graphqlTypes';
import moment from 'moment';
import React, { useState } from 'react';
import { Picker } from 'zarm';

export default function EditingEveryWeekTriggerComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
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
      type: 'AppletDatetimeTrigger',
      params: {
        description: `once every week at ${weekdays[wday]} ${
          hour < 10 ? `0${hour}` : hour
        }:${minute < 10 ? `0${minute}` : minute}`,
        minute: minute.toString(),
        hour: hour.toString(),
        day: '*',
        month: '*',
        wday: wday.toString(),
      },
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
        Save Trigger
      </div>
    </div>
  );
}
