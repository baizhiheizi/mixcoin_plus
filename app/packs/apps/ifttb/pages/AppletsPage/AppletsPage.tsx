import AppletsComponent from 'apps/ifttb/components/AppletsComponent/AppletsComponent';
import {
  ApplicationMenu as ApplicationMenuIcon,
  Down as DownIcon,
} from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Popup } from 'zarm';

export default function AppletsPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <div className='pb-16'>
        <div className='p-4 mb-4 text-xl font-bold text-white bg-dark'>
          IFTT<span className='text-2xl text-btc'>₿</span>
        </div>
        {currentUser ? (
          <>
            <div className='p-4'>
              <AppletsComponent />
            </div>
            <div className='fixed bottom-0 z-10 w-full p-4 mx-auto text-center text-white max-w-screen-md bg-dark'>
              <div className='flex items-center justify-around'>
                {currentUser.mayCreateApplet ? (
                  <div
                    className='px-6 py-2 text-lg text-center bg-gray-600 rounded-full cursor-pointer'
                    onClick={() => history.push('/new')}
                  >
                    Create
                  </div>
                ) : (
                  <div
                    className='px-6 py-2 text-lg text-center bg-gray-600 rounded-full cursor-pointer'
                    onClick={() => history.push('/upgrade')}
                  >
                    Upgrade Pro
                  </div>
                )}
                <div
                  className='px-6 py-2 text-lg text-center bg-gray-600 rounded-full cursor-pointer'
                  onClick={() => setMenuVisible(true)}
                >
                  <ApplicationMenuIcon size='1.75rem' />
                </div>
              </div>
              <div style={{ height: 'env(safe-area-inset-bottom)' }} />
            </div>
          </>
        ) : (
          <div className='flex justify-center p-4 mt-48'>
            <Button
              size='lg'
              theme='primary'
              onClick={() => location.replace('/ifttb/login')}
            >
              Click to login
            </Button>
          </div>
        )}
      </div>
      <Popup visible={menuVisible} onMaskClick={() => setMenuVisible(false)}>
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-2 mb-4 text-xl text-center border rounded-full shadow cursor-pointer'
              onClick={() => history.push('/wallet')}
            >
              Wallet
            </div>
            <div
              className='p-2 mb-4 text-xl text-center border rounded-full shadow cursor-pointer'
              onClick={() => history.push('/stats')}
            >
              Stats
            </div>
            {currentUser.ifttbRole === 'pro' && (
              <div
                className='p-2 mb-4 text-xl text-center border rounded-full shadow cursor-pointer'
                onClick={() => history.push('/archived')}
              >
                Archived Applets
              </div>
            )}
          </div>
        </div>
      </Popup>
    </>
  );
}
