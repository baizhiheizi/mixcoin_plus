import { PageHeader } from 'antd';
import IfttbOrdersComponent from 'apps/admin/components/IfttbOrdersComponent/IfttbOrdersComponent';
import React from 'react';

export default function IfttbOrdersPage() {
  return (
    <>
      <PageHeader title='Swap Orders Manage' />
      <IfttbOrdersComponent />
    </>
  );
}
