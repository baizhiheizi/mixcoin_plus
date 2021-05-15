import { useDebounce } from 'ahooks';
import { Button, Input, PageHeader, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import {
  MixinNetworkUser,
  useAdminMixinNetworkUserConnectionQuery,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

export default function MixinNetworkUsersPage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('all');
  const [type, setType] = useState('OceanBroker');
  const debouncedQuery = useDebounce(query, { wait: 1000 });
  const history = useHistory();
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
  ];

  return (
    <>
      <PageHeader title='Mixin Network Users Manage' />
      <div className='flex justify-between mb-4'>
        <div className='flex'>
          <Select
            className='w-32 mr-2'
            value={type}
            onChange={(value) => setType(value)}
          >
            <Select.Option value=''>All</Select.Option>
            <Select.Option value='OceanBroker'>OceanBroker</Select.Option>
          </Select>
          <Select
            className='w-32 mr-2'
            value={state}
            onChange={(value) => setState(value)}
          >
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='unready'>Unready</Select.Option>
            <Select.Option value='created'>Created</Select.Option>
            <Select.Option value='balanced'>Balanced</Select.Option>
            <Select.Option value='ready'>Ready</Select.Option>
          </Select>
          <Input
            className='w-36'
            placeholder='ID/mixin UUID'
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
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
