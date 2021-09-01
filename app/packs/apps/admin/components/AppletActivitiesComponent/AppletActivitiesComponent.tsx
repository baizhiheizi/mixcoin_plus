import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminAppletActivityConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AppletActivitiesComponent(props: {
  userId?: string;
  appletId?: string;
}) {
  const { userId, appletId } = props;
  const [state, setState] = useState('completed');
  const { loading, data, refetch, fetchMore } =
    useAdminAppletActivityConnectionQuery({
      variables: {
        appletId,
        userId,
        state,
      },
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminAppletActivityConnection: {
      nodes: appletActivities,
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
      dataIndex: 'action',
      key: 'action',
      render: (_, appletActivity) => appletActivity.appletAction.type,
      title: 'action',
    },
    {
      dataIndex: 'applet',
      key: 'applet',
      render: (_, appletActivity) => (
        <Link to={`/applets/${appletActivity.appletAction.applet?.id}`}>
          {appletActivity.appletAction.applet?.title || '-'}
        </Link>
      ),
      title: 'Applet',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
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
            <Select.Option value='drafted'>Drafted</Select.Option>
            <Select.Option value='failed'>Failed</Select.Option>
            <Select.Option value='completed'>Completed</Select.Option>
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
        dataSource={appletActivities}
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
