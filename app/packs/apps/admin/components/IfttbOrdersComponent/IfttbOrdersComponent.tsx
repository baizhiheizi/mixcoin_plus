import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminIfttbOrderConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function IfttbOrdersComponent(props: { userId?: string }) {
  const { userId } = props;
  const [state, setState] = useState('completed');
  const { loading, data, refetch, fetchMore } =
    useAdminIfttbOrderConnectionQuery({
      variables: {
        state,
        userId,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminIfttbOrderConnection: {
      nodes: ifttbOrders,
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
      dataIndex: 'user',
      key: 'user',
      render: (_, order) => (
        <Link to={`/users/${order.user.id}`}>{order.user.name}</Link>
      ),
      title: 'User',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'orderType',
      key: 'orderType',
      title: 'orderType',
    },
    {
      dataIndex: 'asset',
      key: 'asset',
      render: (_, order) => `${order.amount} ${order.asset.symbol}`,
      title: 'Asset',
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
        <div className='flex'>
          <Select
            className='w-32 mr-2'
            value={state}
            onChange={(value) => setState(value)}
          >
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='completed'>Completed</Select.Option>
            <Select.Option value='paid'>Paid</Select.Option>
            <Select.Option value='drafted'>Drafted</Select.Option>
          </Select>
        </div>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={ifttbOrders}
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
