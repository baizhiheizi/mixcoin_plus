import { Button, PageHeader, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminMixinConversationConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router';

export default function MixinConversationsPage() {
  const { loading, data, refetch, fetchMore } =
    useAdminMixinConversationConnectionQuery();
  const history = useHistory();

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMixinConversationConnection: {
      nodes: mixinConversations,
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
      dataIndex: 'conversationId',
      key: 'conversationId',
      title: 'conversationId',
    },
    {
      dataIndex: 'category',
      key: 'category',
      title: 'category',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'name',
    },
    {
      dataIndex: 'creator',
      key: 'creator',
      render: (_, conversation) =>
        conversation.creator ? (
          <div className='flex items-center'>
            <img
              src={conversation.creator.avatar}
              className='w-6 h-6 mr-2 rounded-full'
            />
            {conversation.creator.name}({conversation.creator.mixinId})
          </div>
        ) : (
          '-'
        ),
      title: 'creator',
    },
    {
      dataIndex: 'participantsCount',
      key: 'participantsCount',
      render: (_, conversation) => conversation.participantUuids.length,
      title: 'participantsCount',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'Actions',
      key: 'actions',
      render: (_, conversation) => (
        <a
          onClick={() =>
            history.push(`/mixin_conversations/${conversation.id}`)
          }
        >
          Details
        </a>
      ),
      title: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader
        title='Conversations Manage'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={mixinConversations}
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
