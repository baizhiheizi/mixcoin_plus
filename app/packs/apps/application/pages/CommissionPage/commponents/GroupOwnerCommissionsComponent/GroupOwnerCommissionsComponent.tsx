import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixin } from 'apps/shared';
import { useGroupOwnerCommissionConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function GroupOwnerCommissionsComponent() {
  const { platform } = useMixin();
  const { loading, data, refetch, fetchMore } =
    useGroupOwnerCommissionConnectionQuery();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    groupOwnerCommissionConnection: {
      nodes: commissions,
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
        {commissions.map((commission) => (
          <a
            key={commission.id}
            className='flex items-center px-4 py-2 space-x-4'
            href={
              platform
                ? `mixin://snapshots/${commission.traceId}`
                : `https://mixin.one/snapshots/${commission.snapshotId}`
            }
            target='_blank'
          >
            <img
              className='w-12 h-12 rounded-full'
              src={commission.asset.iconUrl}
            />
            <div className='text-base'>{commission.amount}</div>
            <div className='text-base'>{commission.asset.symbol}</div>
          </a>
        ))}
      </PullComponent>
    </>
  );
}
