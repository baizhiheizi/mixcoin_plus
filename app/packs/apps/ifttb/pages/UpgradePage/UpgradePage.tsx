import { Close as CloseIcon, CheckOne as CheckIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { useIfttbCurrentUserQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router';

export default function UpgradePage() {
  const history = useHistory();
  const { setCurrentUser } = useCurrentUser();
  const [orderType, setOrderType] = useState<'monthly' | 'yearly'>('monthly');
  const { loading, data } = useIfttbCurrentUserQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { currentUser } = data;

  return (
    <>
      <div className='pb-28'>
        <div className='relative p-4 mb-4 text-xl font-bold bg-white'>
          <CloseIcon
            onClick={() => history.goBack()}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Upgrade Plan</div>
        </div>
        <div className='px-4'>
          <div className='flex items-center justify-center mb-4 space-x-2'>
            <span className='text-3xl font-bold'>IFTTB</span>
            <span className='px-1 text-sm text-white rounded bg-btc'>pro</span>
          </div>
          {currentUser.ifttbRole === 'pro' && (
            <div className='mb-4 text-base'>
              Your Pro plan will expired at{' '}
              {moment(currentUser.ifttbProExpiredAt).format('YYYY-MM-DD HH:mm')}
            </div>
          )}

          <div className='flex p-2 mb-4 bg-gray-100'>
            <div
              className={`flex-1 p-4 text-center rounded ${
                orderType === 'monthly' ? 'text-white bg-dark' : ''
              }`}
              onClick={() => setOrderType('monthly')}
            >
              <div className='text-3xl'>$4.99</div>
              <div className='text-sm'>monthly</div>
            </div>
            <div
              className={`flex-1 p-4 text-center rounded ${
                orderType === 'yearly' ? 'text-white bg-dark' : ''
              }`}
              onClick={() => setOrderType('yearly')}
            >
              <div className='text-3xl'>$49.9</div>
              <div className='text-sm'>yearly</div>
            </div>
          </div>
          <div className='flex mb-8'>
            <div className='flex-1' />
            <div
              className={`flex-1 text-center ${
                orderType === 'yearly' ? 'text-green-500' : ''
              }`}
            >
              save 17%
            </div>
          </div>

          <div className='mb-8'>
            <div className='flex items-start mb-4 space-x-2'>
              <CheckIcon size='1rem' theme='filled' fill='#1b1c1e' />
              <span>Unlimited Applet creation</span>
            </div>
            <div className='flex items-start mb-4 space-x-2'>
              <CheckIcon size='1rem' theme='filled' fill='#1b1c1e' />
              <span>More exciting functions under development</span>
            </div>
          </div>
          <div className='p-4 text-2xl text-center text-white rounded-full bg-dark'>
            Upgrade Pro
          </div>
        </div>
      </div>
    </>
  );
}
