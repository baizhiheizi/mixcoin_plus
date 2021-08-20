import React from 'react';
import { Close as CloseIcon } from '@icon-park/react';
import { useHistory } from 'react-router-dom';

export default function NewAppletPage() {
  const history = useHistory();

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
        <div className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'>
          <span className='text-white'>If This</span>
          <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
        </div>
        <div className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg opacity-50 bg-dark'>
          <span className='text-white'>Then Buy</span>
          <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
        </div>
      </div>
    </>
  );
}
