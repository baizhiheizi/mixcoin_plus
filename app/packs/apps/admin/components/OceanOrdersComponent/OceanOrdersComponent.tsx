import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminOceanOrderConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OceanOrdersComponent(props: {
  conversationId?: string;
  userId?: string;
}) {
  const { conversationId, userId } = props;
  const [state, setState] = useState('valid');
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminOceanOrderConnectionQuery({
    variables: { conversationId, state, userId },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminOceanOrderConnection: {
      nodes: oceanOrders,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<any>> = [
    {
      dataIndex: 'traceId',
      key: 'traceId',
      title: 'traceId',
    },
    {
      dataIndex: 'market',
      key: 'market',
      render: (_, order) =>
        `${order.baseAsset.symbol}/${order.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'user',
      key: 'user',
      render: (_, order) => (
        <div className='flex items-center'>
          <img className='w-6 h-6 mr-1 rounded-full' src={order.user.avatar} />
          {order.user.name}({order.user.mixinId})
        </div>
      ),
      title: 'user',
    },
    {
      dataIndex: 'orderType',
      key: 'orderType',
      title: 'orderType',
    },
    {
      dataIndex: 'side',
      key: 'side',
      title: 'side',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      render: (_, order) => `${order.filledAmount}/${order.amount}`,
      title: 'Amount',
    },
    {
      dataIndex: 'funds',
      key: 'funds',
      render: (_, order) => `${order.filledFunds}/${order.funds}`,
      title: 'Funds',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, order) => (
        <>
          <Link to={`/ocean_orders/${order.id}`}>Detail</Link>
        </>
      ),
      title: 'actions',
    },
  ];

  return (
    <>
      <div className='flex justify-between mb-4'>
        <Select
          className='w-32'
          value={state}
          onChange={(value) => setState(value)}
        >
          <Select.Option value='valid'>Valid</Select.Option>
          <Select.Option value='drafted'>Drafted</Select.Option>
          <Select.Option value='paid'>Paid</Select.Option>
          <Select.Option value='booking'>Booking</Select.Option>
          <Select.Option value='completed'>Completed</Select.Option>
          <Select.Option value='canceling'>Cancelling</Select.Option>
          <Select.Option value='refunded'>Refunded</Select.Option>
        </Select>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={oceanOrders}
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
