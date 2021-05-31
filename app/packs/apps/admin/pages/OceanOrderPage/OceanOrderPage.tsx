import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import MixinNetworkSnapshotsComponent from 'apps/admin/components/MixinNetworkSnapshotsComponent/MixinNetworkSnapshotsComponent';
import MixinTransfersComponent from 'apps/admin/components/MixinTransfersComponent/MixinTransfersComponent';
import WalletBalanceComponent from 'apps/admin/components/WalletBalanceComponent/WalletBalanceComponent';
import { useAdminOceanOrderQuery } from 'graphqlTypes';
import React from 'react';
import { useParams } from 'react-router';

export default function OceanOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, data, refetch } = useAdminOceanOrderQuery({
    variables: { id },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminOceanOrder: order } = data;

  return (
    <>
      <PageHeader
        title='Ocean Order'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='traceID'>{order.traceId}</Descriptions.Item>
        <Descriptions.Item label='Market'>
          {order.baseAsset.symbol}/{order.quoteAsset.symbol}
        </Descriptions.Item>
        <Descriptions.Item label='user'>
          {order.user ? (
            <div className='flex items-center'>
              <img
                className='w-6 h-6 mr-1 rounded-full'
                src={order.user.avatar}
              />
              {order.user.name}({order.user.mixinId})
            </div>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='State'>{order.state}</Descriptions.Item>
        <Descriptions.Item label='Amount'>
          {order.filledAmount}/{order.amount}
        </Descriptions.Item>
        <Descriptions.Item label='Funds'>
          {order.filledFunds}/{order.funds}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='snapshots'>
        <Tabs.TabPane tab='Snapshots' key='snapshots'>
          <MixinNetworkSnapshotsComponent oceanOrderId={order.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Broker Wallet' key='wallet'>
          <WalletBalanceComponent userId={order.broker.mixinUuid} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Transfers' key='transfers'>
          <MixinTransfersComponent oceanOrderId={order.id} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
