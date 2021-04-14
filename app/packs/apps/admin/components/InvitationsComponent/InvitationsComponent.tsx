import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminInvitationConnectionQuery } from 'graphqlTypes';
import React from 'react';

export default function InvitationsComponent(props: { invitorId?: string }) {
  const { invitorId } = props;
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminInvitationConnectionQuery({
    variables: { invitorId },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminInvitationConnection: {
      nodes: invitations,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<any>> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'invitor',
      key: 'invitor',
      render: (_, invitation) => (
        <div className='flex items-center'>
          <img
            className='w-6 h-6 mr-1 rounded-full'
            src={invitation.invitor.avatar}
          />
          {invitation.invitor.name}({invitation.invitor.mixinId})
        </div>
      ),
      title: 'invitor',
    },
    {
      dataIndex: 'invitee',
      key: 'invitee',
      render: (_, invitation) => (
        <div className='flex items-center'>
          <img
            className='w-6 h-6 mr-1 rounded-full'
            src={invitation.invitee.avatar}
          />
          {invitation.invitee.name}({invitation.invitee.mixinId})
        </div>
      ),
      title: 'invitee',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
  ];

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={invitations}
        rowKey='id'
        pagination={false}
      />
      <div className='m-4 text-center'>
        <Button
          type='link'
          loading={loading}
          disabled={!hasNextPage}
          onClick={() => {
            fetchMore({
              variables: {
                after: endCursor,
              },
            });
          }}
        >
          {hasNextPage ? 'Load More' : 'No More'}
        </Button>
      </div>
    </>
  );
}
