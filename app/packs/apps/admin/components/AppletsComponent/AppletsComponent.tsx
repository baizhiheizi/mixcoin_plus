import { useDebounce } from 'ahooks';
import { Button, Input, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import {
  useAdminAppletConnectionQuery,
  useAdminSwapOrderConnectionQuery,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AppletsComponent(props: { userId?: string }) {
  const { userId } = props;
  const [filter, setFilter] = useState('connected');
  const { loading, data, refetch, fetchMore } = useAdminAppletConnectionQuery({
    variables: {
      userId,
      filter,
    },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminAppletConnection: {
      nodes: applets,
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
      render: (_, applet) => (
        <Link to={`/users/${applet.user.id}`}>
          {applet.user.name}({applet.user.mixinId})
        </Link>
      ),
      title: 'User',
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: 'title',
    },
    {
      dataIndex: 'connected',
      key: 'connected',
      render: (connected) => (connected ? 'true' : 'false'),
      title: 'Connected',
    },
    {
      dataIndex: 'cron',
      key: 'cron',
      title: 'cron',
    },
    {
      dataIndex: 'frequency',
      key: 'frequency',
      title: 'frequency',
    },
    {
      dataIndex: 'appletActivitiesCount',
      key: 'appletActivitiesCount',
      title: 'Activities',
    },
    {
      dataIndex: 'archivedAt',
      key: 'archivedAt',
      render: (text) => text || '-',
      title: 'archivedAt',
    },
    {
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      render: (text) => text || '-',
      title: 'lastActiveAt',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, applet) => (
        <>
          <Link to={`/applets/${applet.id}`}>Detail</Link>
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
            value={filter}
            onChange={(value) => setFilter(value)}
          >
            <Select.Option value='default'>Default</Select.Option>
            <Select.Option value='archived'>Archived</Select.Option>
            <Select.Option value='connected'>Connected</Select.Option>
            <Select.Option value='all'>All</Select.Option>
          </Select>
        </div>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={applets}
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
