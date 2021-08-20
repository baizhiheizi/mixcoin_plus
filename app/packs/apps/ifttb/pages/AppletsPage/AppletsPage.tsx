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
        <div className='p-4 mb-4 text-lg text-white bg-dark'>IFTTB</div>
        {currentUser ? (
          <AppletsComponent />
        ) : (
          <div className='flex justify-center p-4 mt-48'>
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
      <div className='fixed bottom-0 z-10 w-full p-4 mx-auto text-center text-white max-w-screen-md bg-dark'>
        <div
          className='flex items-center justify-center text-2xl cursor-pointer space-x-2'
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
        <div className='p-4 mb-4 rounded'>
          <div className='text-white'>{applet.title}</div>
        </div>
      ))}
    </PullComponent>
  );
}
