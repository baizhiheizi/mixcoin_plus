import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import { useAppletForm } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

export default function NewAppletPage() {
  const history = useHistory();
  const [chooseTriggerPopupVisible, setChooseTriggerPopupVisible] =
    useState(false);
  const [editTriggerPopupVisible, setEditTriggerPopupVisible] = useState(false);

  const { appletForm, setAppletForm } = useAppletForm();

  return (
    <>
      <div className='relative p-4 mb-8 text-xl font-bold bg-white'>
        <CloseIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create Applet</div>
      </div>
      <div className='p-4'>
        {appletForm?.appletDatetimeTrigger ? (
          <div
            className='flex items-center p-4 mb-8 text-lg font-bold text-white rounded-lg cursor-pointer space-x-4 bg-dark'
            onClick={() => setEditTriggerPopupVisible(true)}
          >
            <span>
              <AlarmClockIcon size='1.5rem' />
            </span>
            <span>{appletForm?.title}</span>
          </div>
        ) : (
          <div
            className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'
            onClick={() => setChooseTriggerPopupVisible(true)}
          >
            <span className='text-white'>If This</span>
            <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
          </div>
        )}
        <div className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg opacity-50 bg-dark'>
          <span className='text-white'>Then Buy</span>
          <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
        </div>
      </div>
      <Popup
        visible={editTriggerPopupVisible}
        onMaskClick={() => setEditTriggerPopupVisible(false)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                setAppletForm(null);
                setEditTriggerPopupVisible(false);
              }}
            >
              Remove Ttrigger
            </div>
          </div>
        </div>
      </Popup>
      <Popup
        visible={chooseTriggerPopupVisible}
        direction='bottom'
        onMaskClick={() => setChooseTriggerPopupVisible(false)}
      >
        <ChooseTriggerComponent />
      </Popup>
    </>
  );
}

function ChooseTriggerComponent() {
  const history = useHistory();
  return (
    <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
      <div className='sticky flex justify-center p-2'>
        <DownIcon size='2rem' />
      </div>
      <div className='p-4 grid grid-cols-2 gap-2'>
        <div
          className='p-4 text-white rounded-lg bg-dark'
          onClick={() => history.push('/triggers/new/datetime')}
        >
          <div className='flex justify-center mb-2 text-lg'>
            <AlarmClockIcon size='1.5rem' />
          </div>
          <div className='text-lg text-center'>Datetime</div>
        </div>
      </div>
    </div>
  );
}
