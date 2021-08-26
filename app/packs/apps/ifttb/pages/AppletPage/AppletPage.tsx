import { Close as CloseIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  useAppletActivityConnectionQuery,
  useAppletQuery,
  useArchiveAppletMutation,
  useToggleAppletConnectedMutation,
} from 'graphqlTypes';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, Modal, Switch } from 'zarm';
import moment from 'moment';
import PullComponent from 'apps/shared/components/PullComponent/PullComponent';

export default function AppletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const [toggleAppletConnected] = useToggleAppletConnectedMutation({
    update: () => Loading.hide(),
  });
  const [archiveApplet] = useArchiveAppletMutation({
    update: () => {
      Loading.hide();
      history.replace('/');
    },
  });
  const { loading, data } = useAppletQuery({ variables: { id } });

  if (loading) {
    return <LoaderComponent />;
  }

  const { applet } = data;

  return (
    <>
      <div className='pb-16'>
        <div className='relative p-4 mb-4 text-xl font-bold bg-white'>
          <CloseIcon
            onClick={() => history.goBack()}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Applet Detail</div>
        </div>
        <div className='p-4'>
          <div className='mb-2 text-base'>{applet.title}</div>
          <div className='flex items-center justify-between mb-2'>
            <span>Connected:</span>
            <Switch
              checked={applet.connected}
              onChange={() =>
                Modal.confirm({
                  title: 'Confirm',
                  content: applet.connected ? (
                    'Are you sure to disconnect this applet?'
                  ) : (
                    <div className='text-base text-left'>
                      Please make sure you have <b>enough balance</b> in your
                      IFTTB wallet to active before connect an applet.
                    </div>
                  ),
                  onOk: () => {
                    Loading.show();
                    toggleAppletConnected({
                      variables: { input: { appletId: applet.id } },
                    });
                  },
                })
              }
            />
          </div>
        </div>
        <div className='px-4'>
          <AppletActivitiesComponent appletId={id} />
        </div>
      </div>
      <div className='fixed bottom-0 z-10 w-full p-4 mx-auto text-center text-white max-w-screen-md bg-dark'>
        <div className='flex items-center justify-around'>
          <div
            className='px-6 py-2 text-lg text-center text-red-500 bg-gray-600 rounded-full cursor-pointer'
            onClick={() => {
              Loading.show();
              archiveApplet({ variables: { input: { appletId: applet.id } } });
            }}
          >
            Archive
          </div>
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
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
      <div className='mb-2 text-base'>Activities:</div>
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
            className='py-1 text-center text-gray-500'
          >
            Applet ran at{' '}
            {moment(appletActivity.createdAt).format('YYYY-MM-DD HH:mm')}
          </div>
        ))}
      </PullComponent>
    </>
  );
}
