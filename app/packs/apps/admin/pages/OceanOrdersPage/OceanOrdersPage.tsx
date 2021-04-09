import { PageHeader } from 'antd';
import OceanOrdersComponent from 'apps/admin/components/OceanOrdersComponent/OceanOrdersComponent';
import React from 'react';

export default function OceanOrdersPage() {
  return (
    <>
      <PageHeader title='Ocean Orders Manage' />
      <OceanOrdersComponent />
    </>
  );
}
