import { PageHeader } from 'antd';
import AppletsComponent from 'apps/admin/components/AppletsComponent/AppletsComponent';
import React from 'react';

export default function AppletsPage() {
  return (
    <>
      <PageHeader title='Applets Manage' />
      <AppletsComponent />
    </>
  );
}
