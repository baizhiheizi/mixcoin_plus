import { PageHeader } from 'antd';
import BookingOrderActivitiesComponent from 'apps/admin/components/BookingOrderActivitiesComponent/BookingOrderActivitiesComponent';
import React from 'react';

export default function BookingOrderActivitiesPage() {
  return (
    <>
      <PageHeader title='Booking Order Activity Activities Manage' />
      <BookingOrderActivitiesComponent />
    </>
  );
}
