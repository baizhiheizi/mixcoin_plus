import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminArbitrageOrderConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ArbitrageOrdersComponent(props: {
  marketId?: string;
  arbitragerId?: string;
}) {
  const { arbitragerId, marketId } = props;
  const [state, setState] = useState('all');
  const { loading, data, refetch, fetchMore } =
    useAdminArbitrageOrderConnectionQuery({
      variables: {
        state,
        arbitragerId,
        marketId,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminArbitrageOrderConnection: {
      nodes: arbitrageOrders,
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
      render: (_, order) =>
        `${order.market.baseAsset.symbol}/${order.market.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'arbitrager',
      key: 'arbitrager',
      render: (_, order) =>
        order.arbitrager ? (
          <Link to={`/mixin_network_users/${order.arbitrager.mixinUuid}`}>
            {order.arbitrager.name}
          </Link>
        ) : (
          '-'
        ),
      title: 'Arbitrager',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      render: (_, order) =>
        `${order.expectedProfit} ${order.profitAsset.symbol}`,
      title: 'expectedProfit',
    },
    {
      dataIndex: 'netProfit',
      key: 'netProfit',
      render: (_, order) =>
        order.netProfit
          ? `${order.netProfit} ${order.profitAsset.symbol}`
          : '-',
      title: 'Net Profit',
    },
    {
      dataIndex: 'raw',
      key: 'raw',
      title: 'raw',
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
        <Link to={`/arbitrage_orders/${order.id}`}>Detail</Link>
      ),
      title: 'Actions',
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
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='drafted'>Drafted</Select.Option>
            <Select.Option value='arbitraging'>Arbitraging</Select.Option>
            <Select.Option value='completed'>Completed</Select.Option>
            <Select.Option value='canceled'>Canceled</Select.Option>
          </Select>
        </div>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={arbitrageOrders}
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
