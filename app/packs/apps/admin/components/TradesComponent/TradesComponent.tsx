import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminTradeConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TradesComponent(props: { marketId?: string }) {
  const { marketId } = props;
  const { loading, data, refetch, fetchMore } = useAdminTradeConnectionQuery({
    variables: { marketId },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminTradeConnection: {
      nodes: trades,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<any>> = [
    {
      dataIndex: 'tradeId',
      key: 'tradeId',
      title: 'tradeId',
    },
    {
      dataIndex: 'market',
      key: 'market',
      render: (_, trade) =>
        `${trade.baseAsset.symbol}/${trade.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'side',
      key: 'side',
      title: 'side',
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: 'price',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      title: 'amount',
    },
    {
      dataIndex: 'tradedAt',
      key: 'tradedAt',
      title: 'tradedAt',
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
        dataSource={trades}
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
