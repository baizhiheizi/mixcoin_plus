import { Close as CloseIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/shared/components/PullComponent/PullComponent';
import {
  Applet,
  useAppletActivityConnectionQuery,
  useAppletQuery,
  useArchiveAppletMutation,
  useToggleAppletConnectedMutation,
} from 'graphqlTypes';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, Modal, Switch, Toast } from 'zarm';

export default function AppletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const [toggleAppletConnected] = useToggleAppletConnectedMutation({
    update: () => Loading.hide(),
  });
  const [confirming, setConfirming] = useState<null | 'connected' | 'archive'>(
    null,
  );
  const [tab, setTab] = useState<'stats' | 'activities'>('stats');
  const [archiveApplet] = useArchiveAppletMutation({
    update: () => {
      Loading.hide();
      history.replace('/');
    },
  });
  const { loading, data } = useAppletQuery({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { applet } = data;

  return (
    <>
      <div className='pb-28'>
        <div className='relative p-4 mb-4 text-xl font-bold bg-white'>
          <CloseIcon
            onClick={() => history.goBack()}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Applet Detail</div>
        </div>
        <div className='p-4'>
          <div className='flex justify-between mb-2 text-gray-500'>
            <span>#{applet.number}</span>
            {applet.profit !== null &&
              (applet.profit >= 0 ? (
                <span className='text-green-500'>
                  +{(applet.profit * 100).toFixed(2)}%
                </span>
              ) : (
                <span className='text-red-500'>
                  {(applet.profit * 100).toFixed(2)}%
                </span>
              ))}
          </div>
          <div className='mb-2 text-base'>{applet.title}</div>
          {applet.archivedAt ? (
            <div className='flex items-center justify-between mb-2'>
              <span>Archived at:</span>
              <span>
                {moment(applet.archivedAt).format('YYYY/MM/DD HH:mm')}
              </span>
            </div>
          ) : (
            <div className='flex items-center justify-between mb-2'>
              <span>Connected:</span>
              <Switch
                checked={applet.connected}
                onChange={() => setConfirming('connected')}
              />
            </div>
          )}
        </div>
        <div className='px-4'>
          <div className='flex items-center p-2 mb-6 bg-gray-100'>
            <div
              className={`flex-1 text-center rounded p-2 ${
                tab === 'stats' ? 'bg-dark text-white' : ''
              }`}
              onClick={() => setTab('stats')}
            >
              Stats
            </div>
            <div
              className={`flex-1 text-center rounded p-2 ${
                tab === 'activities' ? 'bg-dark text-white' : ''
              }`}
              onClick={() => setTab('activities')}
            >
              Activities
            </div>
          </div>
          {tab === 'stats' && <AppletStatsComponent applet={applet} />}
          {tab === 'activities' && <AppletActivitiesComponent appletId={id} />}
        </div>
      </div>
      {!applet.archivedAt && (
        <div className='fixed bottom-0 z-10 w-full p-4 mx-auto text-center text-white max-w-screen-md bg-dark'>
          <div className='flex items-center justify-around'>
            <div
              className='px-6 py-2 text-lg text-center text-red-500 bg-gray-600 rounded-full cursor-pointer'
              onClick={() => setConfirming('archive')}
            >
              Archive
            </div>
            <div
              className='px-6 py-2 text-lg text-center text-white bg-gray-600 rounded-full cursor-pointer'
              onClick={() => {
                if (applet.connected) {
                  Toast.show('Disconnect applet before editing');
                } else {
                  history.push(`/applets/${applet.id}/edit`);
                }
              }}
            >
              Edit
            </div>
          </div>
          <div style={{ height: 'env(safe-area-inset-bottom)' }} />
        </div>
      )}
      <Modal
        visible={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        maskClosable
        closable
        title='Confirm'
      >
        <div className='mb-6 text-lg'>
          {confirming === 'connected' &&
            (applet?.connected ? (
              'Are you sure to disconnect this applet?'
            ) : (
              <span>
                Please make sure you have <b>enough balance</b> in your IFTTB
                wallet to active before connect an applet.
              </span>
            ))}
          {confirming === 'archive' && (
            <span>Are you sure to archive this applet?</span>
          )}
        </div>
        <div
          className='px-4 py-2 text-xl text-center text-white rounded-full bg-dark'
          onClick={() => {
            Loading.show();
            if (confirming === 'connected') {
              toggleAppletConnected({
                variables: { input: { appletId: applet.id } },
              });
            } else if (confirming === 'archive') {
              archiveApplet({ variables: { input: { appletId: applet.id } } });
            }
            setConfirming(null);
          }}
        >
          Confirm
        </div>
      </Modal>
    </>
  );
}

function AppletStatsComponent(props: { applet: Partial<Applet> | any }) {
  const { applet } = props;

  return (
    <div className='p-4 border rounded shadow'>
      <div className='mb-4'>
        <div className='font-bold'>Completed</div>
        <div className='flex items-center justify-end space-x-2'>
          <span>{applet.appletActivitiesCompletedCount}</span>
          <span>times</span>
        </div>
      </div>
      {applet.fillAsset && applet.payAsset && (
        <>
          <div className='mb-2'>
            <div className='font-bold'>Received</div>
            <div className='flex items-center justify-end space-x-2'>
              <img
                className='w-6 h-6 rounded-full'
                src={applet.fillAsset.iconUrl}
              />
              <span>{applet.fillTotal}</span>
              <span>{applet.fillAsset.symbol}</span>
            </div>
            <div className='flex items-center justify-end space-x-2'>
              <span>≈</span>
              <span>${applet.fillTotalUsd.toFixed(2)}</span>
            </div>
          </div>
          <div className='mb-2'>
            <div className='font-bold'>Paid</div>
            <div className='flex items-center justify-end space-x-2'>
              <img
                className='w-6 h-6 rounded-full'
                src={applet.payAsset.iconUrl}
              />
              <span>{applet.payTotal}</span>
              <span>{applet.payAsset.symbol}</span>
            </div>
            <div className='flex items-center justify-end space-x-2'>
              <span>≈</span>
              <span>${applet.payTotalUsd.toFixed(2)}</span>
            </div>
          </div>
          <div className='mb-2'>
            <div className='font-bold'>Profit</div>
            <div className='flex items-center justify-end space-x-2'>
              {applet.profit >= 0 ? (
                <span className='text-green-500'>
                  +${(applet.fillTotalUsd - applet.payTotalUsd).toFixed(2)}
                </span>
              ) : (
                <span className='text-red-500'>
                  -${(applet.payTotalUsd - applet.fillTotalUsd).toFixed(2)}
                </span>
              )}
            </div>
            <div className='flex items-center justify-end space-x-2'>
              {applet.profit >= 0 ? (
                <span className='text-green-500'>
                  +{(applet.profit * 100).toFixed(2)}%
                </span>
              ) : (
                <span className='text-red-500'>
                  -{(-applet.profit * 100).toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AppletActivitiesComponent(props: { appletId: string }) {
  const { appletId } = props;

  const { loading, data, refetch, fetchMore } =
    useAppletActivityConnectionQuery({
      variables: { appletId },
    });
  if (loading) {
    return <LoaderComponent />;
  }

  const {
    appletActivityConnection: {
      nodes: appletActivities,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <>
      <PullComponent
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchMore={() =>
          fetchMore({ variables: { appletId, after: endCursor } })
        }
      >
        {appletActivities.map((appletActivity) => (
          <div
            key={appletActivity.id}
            className={`py-1 text-sm text-center text-gray-500 ${
              appletActivity.state === 'failed' ? 'text-red-500' : ''
            }`}
          >
            Applet {appletActivity.state} at{' '}
            {moment(appletActivity.updatedAt).format('YYYY-MM-DD HH:mm')}
          </div>
        ))}
      </PullComponent>
    </>
  );
}
