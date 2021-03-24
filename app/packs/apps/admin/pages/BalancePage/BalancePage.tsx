import { PageHeader } from 'antd';
import WalletBalanceComponent from 'apps/admin/components/WalletBalanceComponent/WalletBalanceComponent';
import React from 'react';

export default function BalancePage() {
  return (
    <>
      <PageHeader title='Balance Manage' />
      <WalletBalanceComponent />
    </>
  );
}
