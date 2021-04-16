import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { OCEAN_ENGINE_USER_ID } from 'apps/shared';
import { useAdminMixinNetworkSnapshotConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';

export default function MixinNetworkSnapshotsComponent(props: {
  oceanOrderId?: string;
}) {
  const { oceanOrderId } = props;
  const [snapshotType, setSnapshotType] = useState('match_to_user');
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminMixinNetworkSnapshotConnectionQuery({
    variables: { oceanOrderId, snapshotType },
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
      <div className='flex justify-between mb-4'>
        <Select
          className='w-40'
          value={snapshotType}
          onChange={(value) => setSnapshotType(value)}
        >
          <Select.Option value='all'>All</Select.Option>
          <Select.Option value='unprocessed'>Unprocessed</Select.Option>
          <Select.Option value='default'>Default</Select.Option>
          <Select.Option value='ocean_broker_balance'>
            Broker Balance
          </Select.Option>
          <Select.Option value='ocean_broker_register'>
            Broker Register
          </Select.Option>
          <Select.Option value='create_order_from_user'>
            Create from User
          </Select.Option>
          <Select.Option value='create_order_to_engine'>
            Create to Engine
          </Select.Option>
          <Select.Option value='cancel_order_to_engine'>
            Cancel to Engine
          </Select.Option>
          <Select.Option value='refund_from_engine'>
            Refund from Engine
          </Select.Option>
          <Select.Option value='refund_to_user'>Refund to User</Select.Option>
          <Select.Option value='match_from_engine'>
            Match from Engine
          </Select.Option>
          <Select.Option value='match_to_user'>Match to User</Select.Option>
        </Select>
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
