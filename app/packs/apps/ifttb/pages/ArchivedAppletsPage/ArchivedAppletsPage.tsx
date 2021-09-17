import { Left as LeftIcon } from '@icon-park/react';
import AppletsComponent from 'apps/ifttb/components/AppletsComponent/AppletsComponent';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function ArchivedAppletsPage() {
  const history = useHistory();

  return (
    <>
      <div className='relative p-4 text-xl font-bold'>
        <LeftIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Archived Applets</div>
      </div>
      <div className='p-4'>
        <AppletsComponent filter='archived' />
      </div>
    </>
  );
}
