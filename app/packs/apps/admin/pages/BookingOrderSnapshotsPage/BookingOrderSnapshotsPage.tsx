import { PageHeader } from 'antd';
import BookingOrderSnapshotsComponent from 'apps/admin/components/BookingOrderSnapshotsComponent/BookingOrderSnapshotsComponent';
import React from 'react';

export default function BookingOrderSnapshotsPage() {
  return (
    <>
      <PageHeader title='Booking Order Snapshots Manage' />
      <BookingOrderSnapshotsComponent />
    </>
  );
}
