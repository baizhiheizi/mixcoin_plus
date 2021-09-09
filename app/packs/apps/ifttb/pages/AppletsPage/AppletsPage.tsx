import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/shared/components/PullComponent/PullComponent';
import {
  Applet,
  useAppletConnectionQuery,
  useToggleAppletConnectedMutation,
} from 'graphqlTypes';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Loading, Modal, Switch } from 'zarm';

export default function AppletsPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();

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
                  onClick={() => history.push('/wallet')}
                >
                  Wallet
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
    </>
  );
}

function AppletsComponent() {
  const { loading, data, refetch, fetchMore } = useAppletConnectionQuery({
    fetchPolicy: 'cache-and-network',
  });
  const history = useHistory();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [selectedApplet, setSelectedApplet] = useState(null);
  const [toggleAppletConnected] = useToggleAppletConnectedMutation({
    update: () => Loading.hide(),
  });

  useEffect(() => {
    if (data?.currentUser) {
      setCurrentUser(Object.assign({}, currentUser, data.currentUser));
    }
  }, [data?.currentUser]);

  if (loading) {
    return <LoaderComponent />;
  }

  const {
    appletConnection: {
      nodes: applets,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <>
      {currentUser.ifttbRole === 'free' ? (
        <div className='mb-4'>
          You have created {applets.length} / 3 applets.
        </div>
      ) : (
        <div className='mb-4'>
          You are using IFTTB{' '}
          <span
            className='px-1 text-white rounded cursor-pointer bg-btc'
            onClick={() => history.push('/upgrade')}
          >
            Pro
          </span>{' '}
          plan
        </div>
      )}
      <PullComponent
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
      >
        {applets.map((applet: Partial<Applet | any>) => (
          <div key={applet.id} className='p-4 mb-4 border rounded shadow-lg'>
            <div className='mb-2 text-gray-500'>#{applet.number}</div>
            <div
              className='mb-2 text-base'
              onClick={() => history.push(`/applets/${applet.id}`)}
            >
              {applet.title}
            </div>
            <div className='flex items-center justify-between mb-2'>
              <span>Connected:</span>
              <Switch
                checked={applet.connected}
                onChange={() => setSelectedApplet(applet)}
              />
            </div>
            {applet.lastActiveAt && (
              <div className='flex items-center justify-between'>
                <span>Last active:</span>
                <span>{moment(applet.lastActiveAt).fromNow()}</span>
              </div>
            )}
          </div>
        ))}
      </PullComponent>
      <Modal
        visible={Boolean(selectedApplet)}
        onCancel={() => setSelectedApplet(null)}
        maskClosable
        closable
        title='Confirm'
      >
        <div className='mb-6 text-lg'>
          {selectedApplet?.connected ? (
            'Are you sure to disconnect this applet?'
          ) : (
            <span>
              Please make sure you have <b>enough balance</b> in your IFTTB
              wallet to active before connect an applet.
            </span>
          )}
        </div>
        <div
          className='px-4 py-2 text-xl text-center text-white rounded-full bg-dark'
          onClick={() => {
            Loading.show();
            toggleAppletConnected({
              variables: { input: { appletId: selectedApplet?.id } },
            });
            setSelectedApplet(null);
          }}
        >
          Confirm
        </div>
      </Modal>
    </>
  );
}
