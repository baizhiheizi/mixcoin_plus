import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixin } from 'apps/shared';
import { useOceanSnapshotConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function OceanSnapshotsComponent(props: {
  oceanOrderId: string;
}) {
  const { oceanOrderId } = props;
  const { platform } = useMixin();
  const { loading, data, refetch, fetchMore } = useOceanSnapshotConnectionQuery(
    { variables: { oceanOrderId } },
  );
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    oceanSnapshotConnection: {
      nodes: snapshots,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <>
      <PullComponent
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
        emptyText={t('empty_commissions')}
      >
        {snapshots.map((snapshot) => (
          <a
            key={snapshot.traceId}
            className='flex items-center justify-between px-4 py-2'
            href={
              platform
                ? `mixin://snapshots?trace=${snapshot.traceId}`
                : `https://mixin.one/snapshots/${snapshot.snapshotId}`
            }
            target='_blank'
          >
            <div className='flex items-center space-x-2'>
              <img
                className='w-8 h-8 rounded-full'
                src={snapshot.asset.iconUrl}
              />
              <div className='flex items-baseline'>
                <span
                  className={`mr-1 text-base font-bold ${
                    -snapshot.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {-snapshot.amount > 0 && '+'}
                  {-snapshot.amount}
                </span>
                <span className='text-sm font-light'>
                  {snapshot.asset.symbol}
                </span>
              </div>
            </div>
            <div>{t(`transfer_type.${snapshot.snapshotType}`)}</div>
          </a>
        ))}
      </PullComponent>
    </>
  );
}
