import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminBookingOrderSnapshotConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingOrderSnapshotsComponent(props: {
  marketId?: string;
  userId?: string;
  oceanOrderId?: string;
  startedAt?: string;
  endedAt?: string;
}) {
  const { userId, marketId, oceanOrderId, startedAt, endedAt } = props;
  const { loading, data, refetch, fetchMore } =
    useAdminBookingOrderSnapshotConnectionQuery({
      variables: {
        oceanOrderId,
        userId,
        marketId,
        startedAt,
        endedAt,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminBookingOrderSnapshotConnection: {
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
      dataIndex: 'market',
      key: 'market',
      render: (_, snapshot) =>
        `${snapshot.market.baseAsset.symbol}/${snapshot.market.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'user',
      key: 'user',
      render: (_, snapshot) => (
        <Link to={`/users/${snapshot.user.id}`}>{snapshot.user.name}</Link>
      ),
      title: 'User',
    },
    {
      dataIndex: 'funds',
      key: 'funds',
      title: 'funds',
    },
    {
      dataIndex: 'price',
      key: 'price',
      render: (_, snapshot) => (
        <span>
          {snapshot.price} / {snapshot.ticker}
        </span>
      ),
      title: 'price/ticker',
    },
    {
      dataIndex: 'orderWeight',
      key: 'orderWeight',
      title: 'orderWeight',
    },
    {
      dataIndex: 'scores',
      key: 'scores',
      title: 'scores',
    },
    {
      dataIndex: 'timestamp',
      key: 'timestamp',
      title: 'timestamp',
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
        size='small'
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
