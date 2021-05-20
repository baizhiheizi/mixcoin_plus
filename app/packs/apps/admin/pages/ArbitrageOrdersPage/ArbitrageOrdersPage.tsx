import { PageHeader } from 'antd';
import ArbitrageOrdersComponent from 'apps/admin/components/ArbitrageOrdersComponent/ArbitrageOrdersComponent';
import React from 'react';

export default function ArbitrageOrdersPage() {
  return (
    <>
      <PageHeader title='Arbitrage Orders Manage' />
      <ArbitrageOrdersComponent />
    </>
  );
}
