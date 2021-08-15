import { useDebounce } from 'ahooks';
import { Button, Input, PageHeader, Select, Space, Table } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminUserConnectionQuery, User } from 'graphqlTypes';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

export default function UsersPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('default');
  const debouncedQuery = useDebounce(query, { wait: 1000 });
  const history = useHistory();
  const { loading, data, refetch, fetchMore } = useAdminUserConnectionQuery({
    variables: { query: debouncedQuery, order },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminUserConnection: {
      nodes: users,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<Partial<User>>> = [
    {
      dataIndex: 'mixinId',
      key: 'mixinId',
      title: 'Mixin ID',
    },
    {
      dataIndex: 'name',
      key: 'name',
      render: (name, user) => (
        <Space>
          <Avatar src={user.avatar} />
          {name}
        </Space>
      ),
      title: 'Name',
    },
    {
      dataIndex: 'oceanOrdersCount',
      key: 'oceanOrdersCount',
      title: 'Ocean Orders Count',
    },
    {
      dataIndex: 'invitationsCount',
      key: 'invitationsCount',
      title: 'Invitations Count',
    },
    {
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      render: (lastActiveAt) => lastActiveAt || '-',
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
      render: (_, user) => (
        <a onClick={() => history.push(`/users/${user.id}`)}>Details</a>
      ),
      title: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader title='Users Manage' />
      <div className='flex justify-between mb-4'>
        <div className='flex'>
          <Select
            className='w-32 mr-2'
            value={order}
            onChange={(value) => setOrder(value)}
          >
            <Select.Option value='default'>Default</Select.Option>
            <Select.Option value='active'>Active</Select.Option>
            <Select.Option value='orders'>Orders</Select.Option>
            <Select.Option value='invitations'>Invitations</Select.Option>
          </Select>
          <Input
            className='w-36'
            placeholder='User name/mixin ID'
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
        dataSource={users}
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
