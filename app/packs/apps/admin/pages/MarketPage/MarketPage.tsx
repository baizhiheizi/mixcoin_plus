import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import TradesComponent from 'apps/admin/components/TradesComponent/TradesComponent';
import { useAdminMarketQuery } from 'graphqlTypes';
import React from 'react';
import { useParams } from 'react-router';

export default function MarketPage() {
  const { id } = useParams<{ id: string }>();

  const { loading, data, refetch } = useAdminMarketQuery({ variables: { id } });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminMarket: market } = data;

  return (
    <>
      <PageHeader
        title='Market'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='ID'>{market.id}</Descriptions.Item>
        <Descriptions.Item label='Ticker'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </Descriptions.Item>
        <Descriptions.Item label='Orders Count'>
          {market.oceanOrdersCount}
        </Descriptions.Item>
        <Descriptions.Item label='Trades Count'>
          {market.tradesCount}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='orders'>
        <Tabs.TabPane tab='Orders' key='ordrs'>
          <OceanOrdersComponent marketId={market.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Trades' key='trades'>
          <TradesComponent marketId={market.id} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
