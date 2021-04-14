import { PageHeader } from 'antd';
import InvitationsComponent from 'apps/admin/components/InvitationsComponent/InvitationsComponent';
import React from 'react';

export default function InvitationsPage() {
  return (
    <>
      <PageHeader title='Invitations Manage' />
      <InvitationsComponent />
    </>
  );
}
