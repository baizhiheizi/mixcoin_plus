import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import AppletActivitiesComponent from 'apps/admin/components/AppletActivitiesComponent/AppletActivitiesComponent';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import SwapOrdersComponent from 'apps/admin/components/SwapOrdersComponent/SwapOrdersComponent';
import { useAdminAppletQuery } from 'graphqlTypes';
import React from 'react';
import { useParams } from 'react-router';

export default function AppletPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, data, refetch } = useAdminAppletQuery({
    variables: { id },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminApplet: applet } = data;

  return (
    <>
      <PageHeader
        title='Applet'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='ID'>{applet.id}</Descriptions.Item>
        <Descriptions.Item label='number'>{applet.number}</Descriptions.Item>
        <Descriptions.Item label='title'>{applet.title}</Descriptions.Item>
        <Descriptions.Item label='user'>
          {applet.user ? (
            <div className='flex items-center'>
              <img
                className='w-6 h-6 mr-1 rounded-full'
                src={applet.user.avatar}
              />
              {applet.user.name}({applet.user.mixinId})
            </div>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Connected'>
          {applet.connected ? 'true' : 'false'}
        </Descriptions.Item>
        <Descriptions.Item label='lastActiveAt'>
          {applet.lastActiveAt || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='archivedAt'>
          {applet.archivedAt || '-'}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='activities'>
        <Tabs.TabPane tab='Activities' key='activities'>
          <AppletActivitiesComponent appletId={applet.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Swap Orders' key='swap_orders'>
          <SwapOrdersComponent appletId={applet.id} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
