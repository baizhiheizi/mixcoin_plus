import { AppletTriggerInput } from 'graphqlTypes';
import React, { useState } from 'react';
import { Picker } from 'zarm';

export default function AppletDatetimeTriggerMinuteFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const [minute, setMinute] = useState<'1' | '5' | '10' | '15' | '30'>('1');
  const [choosingMinute, setChoosingMinute] = useState(false);
  const createTrigger = () => {
    const trigger = {
      type: 'AppletDatetimeTrigger',
      params: {
        description: `once every ${minute} miniutes`,
        minute: minute === '1' ? '*' : `*/${minute}`,
        hour: '*',
        day: '*',
        month: '*',
        wday: '*',
      },
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
        Save Trigger
      </div>
    </div>
  );
}
