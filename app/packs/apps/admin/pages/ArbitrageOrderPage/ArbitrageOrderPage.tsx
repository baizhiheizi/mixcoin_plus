import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import SwapOrdersComponent from 'apps/admin/components/SwapOrdersComponent/SwapOrdersComponent';
import WalletBalanceComponent from 'apps/admin/components/WalletBalanceComponent/WalletBalanceComponent';
import { useAdminArbitrageOrderQuery } from 'graphqlTypes';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export default function ArbitrageOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, data, refetch } = useAdminArbitrageOrderQuery({
    variables: { id },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminArbitrageOrder: order } = data;

  return (
    <>
      <PageHeader
        title='Arbitrage Order'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='ID'>{order.id}</Descriptions.Item>
        <Descriptions.Item label='Arbitrager'>
          {order.arbitrager ? (
            <Link to={`/mixin_network_users/${order.arbitrager.mixinUuid}`}>
              {order.arbitrager.name}
            </Link>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='State'>{order.state}</Descriptions.Item>
        <Descriptions.Item label='Market'>
          {`${order.market.baseAsset.symbol}/${order.market.quoteAsset.symbol}`}
        </Descriptions.Item>
        <Descriptions.Item label='expectedProfit'>
          {`${order.expectedProfit} ${order.profitAsset.symbol}`}
        </Descriptions.Item>
        <Descriptions.Item label='Net Profit'>
          {`${order.netProfit} ${order.profitAsset.symbol}`}
        </Descriptions.Item>
        <Descriptions.Item label='raw'>{order.raw}</Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='snapshots'>
        <Tabs.TabPane tab='Ocean Orders' key='oceanOrders'>
          <OceanOrdersComponent arbitrageOrderId={order.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Swap Orders' key='swapOrders'>
          <SwapOrdersComponent arbitrageOrderId={order.id} />
        </Tabs.TabPane>
        {order.arbitrager && (
          <Tabs.TabPane tab='Broker Wallet' key='wallet'>
            <WalletBalanceComponent userId={order.arbitrager.mixinUuid} />
          </Tabs.TabPane>
        )}
      </Tabs>
    </>
  );
}
