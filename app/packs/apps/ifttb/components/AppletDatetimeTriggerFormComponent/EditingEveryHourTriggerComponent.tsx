import React, { useState } from 'react';
import { Picker } from 'zarm';

export default function EditingEveryHourTriggerComponent(props: {
  onFinish: (trigger) => any;
}) {
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
      minute: minute.toString(),
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
