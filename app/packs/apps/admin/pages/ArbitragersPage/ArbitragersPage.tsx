import { PageHeader } from 'antd';
import MixinNetworkUsersComponent from 'apps/admin/components/MixinNetworkUsersComponent/MixinNetworkUsersComponent';
import React from 'react';

export default function ArbitragersPage() {
  return (
    <>
      <PageHeader title='Arbitragers Manage' />
      <MixinNetworkUsersComponent type='Arbitrager' />
    </>
  );
}
