import { PageHeader } from 'antd';
import AppletActivitiesComponent from 'apps/admin/components/AppletActivitiesComponent/AppletActivitiesComponent';
import React from 'react';

export default function AppletActivitiesPage() {
  return (
    <>
      <PageHeader title='Applet Activities Manage' />
      <AppletActivitiesComponent />
    </>
  );
}
