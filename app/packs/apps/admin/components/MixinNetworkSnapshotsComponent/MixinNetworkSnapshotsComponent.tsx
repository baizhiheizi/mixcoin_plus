import { Button, PageHeader, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { OCEAN_ENGINE_USER_ID } from 'apps/shared';
import { useAdminMixinNetworkSnapshotConnectionQuery } from 'graphqlTypes';
import React from 'react';

export default function MixinNetworkSnapshotsComponent(props: {
  oceanOrderId?: string;
}) {
  const { oceanOrderId } = props;
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminMixinNetworkSnapshotConnectionQuery({
    variables: { oceanOrderId },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMixinNetworkSnapshotConnection: {
      nodes: snapshots,
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
      dataIndex: 'opponent',
      key: 'opponent',
      render: (_, snapshot) => (
        <>
          {snapshot.opponentId === OCEAN_ENGINE_USER_ID ? (
            'OCEAN ENGINE'
          ) : snapshot.opponent ? (
            <div>
              {snapshot.opponent.name}({snapshot.opponent.mixinId})
            </div>
          ) : (
            snapshot.opponentId
          )}
        </>
      ),
      title: 'Opponent',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      render: (_, snapshot) => `${snapshot.amount} ${snapshot.asset.symbol}`,
      title: 'Amount',
    },
    {
      dataIndex: 'snapshotType',
      key: 'snapshotType',
      title: 'Snapshot Type',
      render: (_, snapshot) =>
        `${snapshot.type || '-'}/${snapshot.snapshotType || '-'}`,
    },
    {
      dataIndex: 'data',
      key: 'data',
      render: (text) => <span className='max-w-sm line-clamp-2'>{text}</span>,
      title: 'memo',
    },
    {
      dataIndex: 'processedAt',
      key: 'processedAt',
      title: 'processedAt',
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
        dataSource={snapshots}
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
