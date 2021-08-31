import { Avatar, Button, Descriptions, PageHeader, Space, Tabs } from 'antd';
import AppletsComponent from 'apps/admin/components/AppletsComponent/AppletsComponent';
import InvitationsComponent from 'apps/admin/components/InvitationsComponent/InvitationsComponent';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import MixinTransfersComponent from 'apps/admin/components/MixinTransfersComponent/MixinTransfersComponent';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import UserDeprecatedOceanOrdersComponent from 'apps/admin/components/UserDeprecatedOceanOrdersComponent/UserDeprecatedOceanOrdersComponent';
import UserDeprecatedOceanSnapshotsComponent from 'apps/admin/components/UserDeprecatedOceanSnapshotsComponent/UserDeprecatedOceanSnapshotsComponent';
import WalletBalanceComponent from 'apps/admin/components/WalletBalanceComponent/WalletBalanceComponent';
import { useAdminUserQuery } from 'graphqlTypes';
import React from 'react';
import { useParams } from 'react-router';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();

  const { loading, data, refetch } = useAdminUserQuery({ variables: { id } });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminUser: user } = data;

  return (
    <>
      <PageHeader
        title='User'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='ID'>{user.id}</Descriptions.Item>
        <Descriptions.Item label='Mixin ID'>{user.mixinId}</Descriptions.Item>
        <Descriptions.Item label='Mixin UUID'>
          {user.mixinUuid}
        </Descriptions.Item>
        <Descriptions.Item label='Name'>
          <Space>
            <Avatar src={user.avatar} />
            {user.name}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label='Invitor'>
          {user.invitor ? (
            <Space>
              <Avatar src={user.invitor.avatar} />
              {user.invitor.name} ({user.invitor.mixinId})
            </Space>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Invitations Count'>
          {user.invitationsCount}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {user.createdAt}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='applets'>
        <Tabs.TabPane tab='Applets' key='applets'>
          <AppletsComponent userId={user.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Orders' key='orders'>
          <OceanOrdersComponent userId={user.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Received' key='received'>
          <MixinTransfersComponent opponentId={user.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Broker Wallet' key='wallet'>
          <WalletBalanceComponent userId={user.broker.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Broker Transfers' key='transfers'>
          <MixinTransfersComponent userId={user.broker.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Invitations' key='invitations'>
          <InvitationsComponent invitorId={user.id} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab='DeprecatedOceanSnapshots'
          key='deprecatedOceanSnapshots'
        >
          <UserDeprecatedOceanSnapshotsComponent userId={user.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='DeprecatedOceanOrders' key='deprecatedOceanOrders'>
          <UserDeprecatedOceanOrdersComponent userId={user.id} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
