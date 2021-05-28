import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixin } from 'apps/shared';
import { useInvitationCommissionConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function InvitationCommissionsComponent() {
  const { platform } = useMixin();
  const { loading, data, refetch, fetchMore } =
    useInvitationCommissionConnectionQuery();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    invitationCommissionConnection: {
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
                ? `mixin://snapshots?trace=${commission.traceId}`
                : `https://mixin.one/snapshots/${commission.snapshotId}`
            }
            target='_blank'
          >
            <img
              className='w-12 h-12 rounded-full'
              src={commission.asset.iconUrl}
            />
            <div className='text-base'>
              {commission.amount} {commission.asset.symbol}
            </div>
          </a>
        ))}
      </PullComponent>
    </>
  );
}
