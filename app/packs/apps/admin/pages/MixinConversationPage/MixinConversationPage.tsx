import { Avatar, Descriptions, List, PageHeader, Tabs } from 'antd';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import { useAdminMixinConversationQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory, useParams } from 'react-router';

export default function MixinConversationPage() {
  const { id } = useParams<{ id: string }>();

  const { loading, data, refetch } = useAdminMixinConversationQuery({
    variables: { id },
  });
  const history = useHistory();

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminMixinConversation: conversation } = data;

  return (
    <>
      <PageHeader title='Mixin Conversation' />
      <Descriptions>
        <Descriptions.Item label='ID'>{conversation.id}</Descriptions.Item>
        <Descriptions.Item label='Conversation ID'>
          {conversation.conversationId}
        </Descriptions.Item>
        <Descriptions.Item label='category'>
          {conversation.category}
        </Descriptions.Item>
        <Descriptions.Item label='name'>
          {conversation.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='creator'>
          {conversation.creator ? (
            <div className='flex items-center'>
              <img
                src={conversation.creator.avatar}
                className='w-6 h-6 mr-2 rounded-full'
              />
              {conversation.creator.name}({conversation.creator.mixinId})
            </div>
          ) : (
            conversation.creatorId || '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='participantsCount'>
          {conversation.participantUuids.length}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='orders'>
        <Tabs.TabPane tab='Orders' key='orders'>
          <OceanOrdersComponent conversationId={conversation.conversationId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Participants' key='participant'>
          <List
            itemLayout='horizontal'
            dataSource={conversation.participants}
            renderItem={(participant) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={participant.avatar} />}
                  title={participant.name}
                  description={participant.mixinId}
                />
              </List.Item>
            )}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
