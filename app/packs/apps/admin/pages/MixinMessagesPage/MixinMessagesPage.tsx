import { Button, PageHeader, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminMixinMessageConnectionQuery } from 'graphqlTypes';
import React from 'react';

export default function MixinMessagesPage() {
  const { loading, data, refetch, fetchMore } =
    useAdminMixinMessageConnectionQuery();

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMixinMessageConnection: {
      nodes: mixinMessages,
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
      dataIndex: 'category',
      key: 'category',
      title: 'category',
    },
    {
      dataIndex: 'conversationId',
      key: 'conversationId',
      title: 'conversationId',
    },
    {
      dataIndex: 'user',
      key: 'user',
      render: (_, mixinMessage) =>
        mixinMessage.user ? (
          <div className='flex items-center'>
            <img
              src={mixinMessage.user.avatar}
              className='w-6 h-6 mr-2 rounded-full'
            />
            {mixinMessage.user.name}({mixinMessage.user.mixinId})
          </div>
        ) : (
          mixinMessage.userId
        ),
      title: 'user',
    },
    {
      dataIndex: 'content',
      key: 'content',
      render: (text) => <span className='max-w-md line-clamp-3'>{text}</span>,
      title: 'content',
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
        dataSource={mixinMessages}
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
