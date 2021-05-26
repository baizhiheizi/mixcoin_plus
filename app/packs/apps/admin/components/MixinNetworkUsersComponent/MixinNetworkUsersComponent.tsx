import { useDebounce } from 'ahooks';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import {
  MixinNetworkUser,
  useAdminMixinNetworkUserConnectionQuery,
} from 'graphqlTypes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function MixinNetworkUsersComponent(props: {
  query?: string;
  state?: string;
  type?: string;
}) {
  const { query, state = 'all', type } = props;
  const debouncedQuery = useDebounce(query, { wait: 1000 });
  const { loading, data, refetch, fetchMore } =
    useAdminMixinNetworkUserConnectionQuery({
      variables: { query: debouncedQuery, state, type },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMixinNetworkUserConnection: {
      nodes: users,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<Partial<MixinNetworkUser & any>>> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'mixinUuid',
      key: 'mixinUuid',
      title: 'mixin UUID',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'owner',
      key: 'owner',
      render: (_, user) =>
        user.owner ? `${user.owner.name}(${user.owner.mixinId})` : '-',
      title: 'Owner',
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: 'type',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'hasPin',
      key: 'hasPin',
      render: (_, user) => (user.hasPin ? 'Yes' : 'No'),
      title: 'hasPin',
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
        <Link to={`/mixin_network_users/${user.mixinUuid}`}>Detail</Link>
      ),
      title: 'Actions',
    },
  ];

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button key='refresh' type='primary' onClick={() => refetch()}>
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
