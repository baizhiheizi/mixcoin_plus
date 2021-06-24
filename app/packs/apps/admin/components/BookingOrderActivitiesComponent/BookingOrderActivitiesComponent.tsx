import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminBookingOrderActivityConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingOrderActivitiesComponent(props: {
  marketId?: string;
}) {
  const { marketId } = props;
  const { loading, data, refetch, fetchMore } =
    useAdminBookingOrderActivityConnectionQuery({
      variables: {
        marketId,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminBookingOrderActivityConnection: {
      nodes: activities,
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
      render: (_, activity) =>
        `${activity.market.baseAsset.symbol}/${activity.market.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: (_, activity) => (
        <>
          {activity.startedAt}~{activity.endedAt}
        </>
      ),
      title: 'Date',
    },
    {
      dataIndex: 'bonusTotal',
      key: 'bonusTotal',
      render: (_, activity) => (
        <>
          {activity.bonusTotal} {activity.bonusAsset.symbol}
        </>
      ),
      title: 'bonusTotal',
    },
    {
      dataIndex: 'scoresTotal',
      key: 'scoresTotal',
      title: 'scoresTotal',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, activity) => (
        <Link to={`/booking_order_activities/${activity.id}`}>Details</Link>
      ),
      title: 'Actions',
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
        dataSource={activities}
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
