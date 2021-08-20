import { Add as AddIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/shared/components/PullComponent/PullComponent';
import { Applet, useAppletConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'zarm';

export default function AppletsPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  return (
    <>
      <div className='pb-16'>
        <div className='bg-dark mb-4 p-4 text-lg text-white'>IFTTB</div>
        {currentUser ? (
          <AppletsComponent />
        ) : (
          <div className='mt-48 p-4 flex justify-center'>
            <Button
              size='lg'
              theme='primary'
              onClick={() => location.replace('/ifttb/login')}
            >
              Please Login First
            </Button>
          </div>
        )}
      </div>
      <div className='mx-auto max-w-screen-md bg-dark fixed text-white bottom-0 z-10 p-4 text-center w-full'>
        <div
          className='text-2xl flex items-center justify-center space-x-2'
          onClick={() => history.push('/new')}
        >
          <AddIcon size='2rem' /> <div>CREATE</div>
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  );
}

function AppletsComponent() {
  const { loading, data, refetch } = useAppletConnectionQuery();

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
    <PullComponent
      hasNextPage={hasNextPage}
      refetch={() => refetch({ after: endCursor })}
    >
      {applets.map((applet: Partial<Applet>) => (
        <div className='p-4 rounded mb-4'>
          <div className='text-white'>{applet.title}</div>
        </div>
      ))}
    </PullComponent>
  );
}
