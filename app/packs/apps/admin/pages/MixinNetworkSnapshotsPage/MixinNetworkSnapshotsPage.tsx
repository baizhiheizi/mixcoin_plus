import { PageHeader } from 'antd';
import MixinNetworkSnapshotsComponent from 'apps/admin/components/MixinNetworkSnapshotsComponent/MixinNetworkSnapshotsComponent';
import React from 'react';

export default function MixinNetworkSnapshotsPage() {
  return (
    <>
      <PageHeader title='MixinNetworkSnapshots Manage' />
      <MixinNetworkSnapshotsComponent />
    </>
  );
}
