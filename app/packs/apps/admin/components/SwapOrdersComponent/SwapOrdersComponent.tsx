import { useDebounce } from 'ahooks';
import { Button, Input, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminSwapOrderConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SwapOrdersComponent(props: {
  brokerId?: string;
  userId?: string;
  arbitrageOrderId?: string;
  appletId?: string;
}) {
  const { brokerId, userId, arbitrageOrderId, appletId } = props;
  const [state, setState] = useState('valid');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { wait: 1000 });
  const { loading, data, refetch, fetchMore } =
    useAdminSwapOrderConnectionQuery({
      variables: {
        appletId,
        arbitrageOrderId,
        state,
        brokerId,
        userId,
        query: debouncedQuery,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminSwapOrderConnection: {
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
      dataIndex: 'broker',
      key: 'broker',
      render: (_, order) => (
        <Link to={`/mixin_network_users/${order.brokerId}`}>
          {order.broker.name}
        </Link>
      ),
      title: 'Broker',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'payAmount',
      key: 'payAmount',
      render: (_, order) =>
        `${order.payAmount || '-'} ${order.payAsset.symbol}`,
      title: 'payAmount',
    },
    {
      dataIndex: 'fillAmount',
      key: 'fillAmount',
      render: (_, order) =>
        `${order.fillAmount || '-'} ${order.fillAsset.symbol}`,
      title: 'fillAmount',
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
          <Link to={`/swap_orders/${order.id}`}>Detail</Link>
        </>
      ),
      title: 'actions',
    },
  ];

  return (
    <>
      <div className='flex justify-between mb-4'>
        <div className='flex'>
          <Select
            className='w-32 mr-2'
            value={state}
            onChange={(value) => setState(value)}
          >
            <Select.Option value='valid'>Valid</Select.Option>
            <Select.Option value='drafted'>Drafted</Select.Option>
            <Select.Option value='paid'>Paid</Select.Option>
            <Select.Option value='swapping'>Swapping</Select.Option>
            <Select.Option value='traded'>Traded</Select.Option>
            <Select.Option value='rejected'>Rejected</Select.Option>
          </Select>
          <Input
            className='w-64'
            placeholder='trade ID'
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
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
