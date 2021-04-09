import { Button, PageHeader, Space, Table } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminUserConnectionQuery, User } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router';

export default function UsersPage() {
  const { loading, data, refetch, fetchMore } = useAdminUserConnectionQuery();
  const history = useHistory();

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
      <PageHeader
        title='Users Manage'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={users}
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
