import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixin } from 'apps/shared';
import { MixinNetworkSnapshot, useUserSnapshotsQuery } from 'graphqlTypes';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export default function SnapshotsPage() {
  const { t } = useTranslation();
  const { platform } = useMixin();
  const { assetId } = useParams<{ assetId: string }>();
  const { loading, data, refetch, fetchMore } = useUserSnapshotsQuery({
    variables: { asset: assetId },
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { userSnapshots: snapshots } = data;

  return (
    <>
      <NavbarComponent back={true} />
      <PullComponent
        hasNextPage={snapshots.length % 50 === 0}
        refetch={refetch}
        fetchMore={() =>
          fetchMore({
            variables: { offset: snapshots[snapshots.length - 1].createdAt },
          })
        }
      >
        {snapshots.map((snapshot: MixinNetworkSnapshot) => (
          <div
            key={snapshot.traceId}
            className='flex items-center px-4 py-2 bg-white dark:bg-dark'
            onClick={() => {
              if (platform) {
                location.replace(`mixin://snapshots?trace=${snapshot.traceId}`);
              }
            }}
          >
            <div className='relative'>
              <img
                className='w-8 h-8 rounded-full'
                src={snapshot.asset.iconUrl.replace(/s128$/, 's64')}
              />
              {snapshot.asset.chainAsset && (
                <img
                  className='absolute bottom-0 left-0 w-2.5 h-2.5 border border-white rounded-full'
                  src={snapshot.asset.chainAsset.iconUrl.replace(/s128/, 's32')}
                />
              )}
            </div>
            <div
              className={`text-bold text-lg ml-2 ${
                snapshot.amount < 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {snapshot.amount > 0 && '+'}
              {snapshot.amount.toFixed(8)}
            </div>
            <div className='ml-1 text-xs font-light'>
              {snapshot.asset.symbol}
            </div>
            <div className='ml-auto text-xs text-gray-500 dark:text-gray-800'>
              {moment(snapshot.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
        ))}
      </PullComponent>
    </>
  );
}
