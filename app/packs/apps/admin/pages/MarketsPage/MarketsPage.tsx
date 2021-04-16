import { Button, PageHeader, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminMarketConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function MarketsPage() {
  const { loading, data, refetch, fetchMore } = useAdminMarketConnectionQuery();

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMarketConnection: {
      nodes: markets,
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
      dataIndex: 'base/quote',
      key: 'base/quote',
      render: (_, market) =>
        `${market.baseAsset.symbol}/${market.quoteAsset.symbol}`,
      title: 'base/quote',
    },
    {
      dataIndex: 'oceanOrdersCount',
      key: 'oceanOrdersCount',
      title: 'oceanOrdersCount',
    },
    {
      dataIndex: 'tradesCount',
      key: 'tradesCount',
      title: 'tradesCount',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'Actions',
      key: 'Actions',
      render: (_, market) => <Link to={`/markets/${market.id}`}>Detail</Link>,
      title: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader
        title='Market Manage'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={markets}
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
