import { PageHeader } from 'antd';
import MixinTransfersComponent from 'apps/admin/components/MixinTransfersComponent/MixinTransfersComponent';
import React from 'react';

export default function MixinTransfersPage() {
  return (
    <>
      <PageHeader title='Transfers Manage' />
      <MixinTransfersComponent />
    </>
  );
}
