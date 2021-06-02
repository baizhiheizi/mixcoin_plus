import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import ArbitrageOrdersComponent from 'apps/admin/components/ArbitrageOrdersComponent/ArbitrageOrdersComponent';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import MixinTransfersComponent from 'apps/admin/components/MixinTransfersComponent/MixinTransfersComponent';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import SwapOrdersComponent from 'apps/admin/components/SwapOrdersComponent/SwapOrdersComponent';
import WalletBalanceComponent from 'apps/admin/components/WalletBalanceComponent/WalletBalanceComponent';
import { useAdminMixinNetworkUserQuery } from 'graphqlTypes';
import QRCode from 'qrcode.react';
import React from 'react';
import { useParams } from 'react-router';

export default function ArbitragerPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const { loading, data, refetch } = useAdminMixinNetworkUserQuery({
    variables: { mixinUuid: uuid },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminMixinNetworkUser: user } = data;

  return (
    <>
      <PageHeader
        title='Mixin Network User Manage'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='Mixin UUID'>
          {user.mixinUuid}
        </Descriptions.Item>
        <Descriptions.Item label='Name'>{user.name}</Descriptions.Item>
        <Descriptions.Item label='Receive'>
          <QRCode value={`mixin://transfer/${user.mixinUuid}`} size={100} />
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='balance'>
        <Tabs.TabPane tab='Balance' key='balance'>
          <WalletBalanceComponent userId={user.mixinUuid} />
        </Tabs.TabPane>
        {user.type === 'Arbitrager' && (
          <Tabs.TabPane tab='Arbitrager Orders' key='arbitrageOrders'>
            <ArbitrageOrdersComponent arbitragerId={user.mixinUuid} />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab='Ocean Orders' key='oceanOrders'>
          <OceanOrdersComponent brokerId={user.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Swap Orders' key='swapOrders'>
          <SwapOrdersComponent brokerId={user.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Transfers' key='transfers'>
          <MixinTransfersComponent userId={user.mixinUuid} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
