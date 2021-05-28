import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixin } from 'apps/shared';
import { useInviteeConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function InviteesComponent() {
  const { loading, data, refetch, fetchMore } = useInviteeConnectionQuery();
  const { t } = useTranslation();
  const { platform } = useMixin();

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    inviteeConnection: {
      nodes: invitees,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <>
      <PullComponent
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
        emptyText={t('empty_invitees')}
      >
        {invitees.map((invitee) => (
          <div
            key={invitee.mixinId}
            className='flex items-center px-4 py-2 space-x-4'
            onClick={() => {
              if (platform) {
                location.replace(`mixin://users/${invitee.mixinUuid}`);
              }
            }}
          >
            <img className='w-12 h-12 rounded-full' src={invitee.avatar} />
            <div className='text-base line-clamp-1'>{invitee.name}</div>
          </div>
        ))}
      </PullComponent>
    </>
  );
}
