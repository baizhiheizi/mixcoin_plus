import { Button, PageHeader, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminOceanMarketConnectionQuery } from 'graphqlTypes';
import React from 'react';

export default function OceanMarketsPage() {
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminOceanMarketConnectionQuery();

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminOceanMarketConnection: {
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
      dataIndex: 'turnover',
      key: 'turnover',
      title: 'Turnover',
    },
    {
      dataIndex: 'makerTurnover',
      key: 'makerTurnover',
      title: 'makerTurnover',
    },
    {
      dataIndex: 'takerTurnover',
      key: 'takerTurnover',
      title: 'takerTurnover',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
  ];

  return (
    <>
      <PageHeader
        title='Message Manage'
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
